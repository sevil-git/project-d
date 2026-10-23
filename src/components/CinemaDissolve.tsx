import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { Texture } from 'three'
import { cinemaArtworks } from '../data/artworks'

export type ReelFrame = { from: number; to: number; blend: number }
export type DissolveRender = () => boolean

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`
const fragmentShader = `
  uniform sampler2D uFrom;
  uniform sampler2D uTo;
  uniform vec2 uResolution;
  uniform float uFromAspect;
  uniform float uToAspect;
  uniform float uProgress;
  uniform float uSeed;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + 1.0), f.x), f.y);
  }
  float fbm(vec2 p) {
    float value = 0.0, weight = 0.5;
    for (int i = 0; i < 4; i++) {
      value += weight * noise(p);
      p = mat2(1.6, 1.2, -1.2, 1.6) * p + 3.1;
      weight *= 0.5;
    }
    return value / 0.9375;
  }
  vec4 contained(sampler2D image, vec2 uv, float aspect, float zoom) {
    float viewAspect = uResolution.x / uResolution.y;
    vec2 scale = vec2(max(viewAspect / aspect, 1.0), max(aspect / viewAspect, 1.0));
    vec2 sampleUv = (uv - 0.5) * scale / zoom + 0.5;
    float inside = step(0.0, sampleUv.x) * step(sampleUv.x, 1.0)
      * step(0.0, sampleUv.y) * step(sampleUv.y, 1.0);
    return vec4(texture2D(image, clamp(sampleUv, 0.0, 1.0)).rgb, inside);
  }
  void main() {
    vec2 p = vUv * vec2(uResolution.x / uResolution.y, 1.0);
    float field = 0.65 * fbm(p * 5.0 + uSeed) + 0.22 * vUv.x + 0.13 * vUv.y;
    float threshold = mix(-0.15, 1.15, uProgress);
    float reveal = 1.0 - smoothstep(threshold - 0.045, threshold + 0.045, field);
    float energy = sin(uProgress * 3.14159265);
    vec2 drift = vec2(noise(p * 9.0 + uSeed), noise(p.yx * 8.0 - uSeed)) - 0.5;
    vec4 a = contained(uFrom, vUv + drift * energy * 0.035, uFromAspect, 1.0 - 0.035 * uProgress);
    vec4 b = contained(uTo, vUv - drift * energy * 0.025, uToAspect, 0.92 + 0.08 * uProgress);
    float alpha = mix(a.a, b.a, reveal);
    vec3 color = mix(a.rgb * a.a, b.rgb * b.a, reveal) / max(alpha, 0.0001);
    float edge = 1.0 - smoothstep(0.012, 0.06, abs(field - threshold));
    color += vec3(0.19, 0.09, 0.025) * edge * energy;
    color += (hash(floor(vUv * uResolution) + uSeed) - 0.5) * 0.035 * energy;
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`

/** Loads Three and adjacent optimized images near the reel; renders only when something changes. */
export default function CinemaDissolve({ frame, renderRef, onChange }: {
  frame: RefObject<ReelFrame>; renderRef: RefObject<DissolveRender | null>; onChange: () => void
}) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const host = root.current
    if (!host) return
    const screen = host.parentElement!
    let cancelled = false
    let dispose: (() => void) | undefined
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      observer.disconnect()
      void initialize().catch(() => { screen.dataset.dissolveActive = 'false' })
    }, { rootMargin: '100% 0px' })
    const initialize = async () => {
      const THREE = await import('three')
      if (cancelled) return
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'low-power' })
      if (!gl) return // The existing HTML pictures remain the fallback.
      const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.setClearColor(0x000000, 0)
      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const geometry = new THREE.PlaneGeometry(2, 2)
      const uniforms = {
        uFrom: { value: null as Texture | null }, uTo: { value: null as Texture | null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uFromAspect: { value: 1 }, uToAspect: { value: 1 }, uProgress: { value: 0 }, uSeed: { value: 0 },
      }
      const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader,
        transparent: true, depthTest: false, depthWrite: false })
      scene.add(new THREE.Mesh(geometry, material))
      const textures = new Map<number, Texture>()
      const requested = new Map<number, number>()
      const loader = new THREE.TextureLoader()
      let failed = false
      const deactivate = () => { screen.dataset.dissolveActive = 'false' }
      const load = (index: number) => {
        if (index >= cinemaArtworks.length) return
        const art = cinemaArtworks[index]
        const variants = art.media.variants.filter(variant => variant.format === 'webp')
        const fittedWidth = Math.min(host.clientWidth, host.clientHeight * art.media.original.width / art.media.original.height)
        const width = Math.min(fittedWidth * renderer.getPixelRatio(), 1600)
        const variant = variants.find(item => item.width >= width) ?? variants[variants.length - 1]
        if ((requested.get(index) ?? 0) >= variant.width) return
        requested.set(index, variant.width)
        loader.load(variant.url, texture => {
          if (cancelled || requested.get(index) !== variant.width) { texture.dispose(); return }
          texture.colorSpace = THREE.SRGBColorSpace
          texture.minFilter = THREE.LinearFilter
          texture.generateMipmaps = false
          textures.get(index)?.dispose()
          textures.set(index, texture)
          onChange()
        }, undefined, () => { /* Keep the HTML fallback if a texture cannot load. */ })
      }
      const render = () => {
        const { from, to, blend } = frame.current
        load(from); load(to); load(to + 1)
        const a = textures.get(from), b = textures.get(to)
        if (failed || !a || !b || (from === 0 && blend === 0)) { deactivate(); return false }
        uniforms.uFrom.value = a; uniforms.uTo.value = b
        const ratio = (index: number) => cinemaArtworks[index].media.original.width / cinemaArtworks[index].media.original.height
        uniforms.uFromAspect.value = ratio(from); uniforms.uToAspect.value = ratio(to)
        uniforms.uProgress.value = blend; uniforms.uSeed.value = from * 7.31
        renderer.render(scene, camera)
        screen.dataset.dissolveActive = String(!failed)
        canvas.dataset.blend = blend.toFixed(3)
        canvas.dataset.from = String(from + 1); canvas.dataset.to = String(to + 1)
        return !failed
      }
      renderer.debug.onShaderError = () => { failed = true; deactivate() }
      const resize = new ResizeObserver(() => {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
        renderer.setSize(Math.max(1, host.clientWidth), Math.max(1, host.clientHeight), false)
        uniforms.uResolution.value.set(host.clientWidth, host.clientHeight)
        onChange()
      })
      const lost = (event: Event) => { event.preventDefault(); failed = true; onChange() }
      const restored = () => { failed = false; onChange() }
      canvas.addEventListener('webglcontextlost', lost)
      canvas.addEventListener('webglcontextrestored', restored)
      host.appendChild(canvas)
      renderRef.current = render
      resize.observe(host)
      onChange()
      dispose = () => {
        renderRef.current = null
        resize.disconnect()
        canvas.removeEventListener('webglcontextlost', lost)
        canvas.removeEventListener('webglcontextrestored', restored)
        textures.forEach(texture => texture.dispose())
        geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss()
        canvas.remove(); deactivate()
      }
    }
    observer.observe(host)
    return () => { cancelled = true; observer.disconnect(); dispose?.() }
  }, [frame, renderRef, onChange])
  return <div className="cinema-dissolve" ref={root} aria-hidden="true" />
}
