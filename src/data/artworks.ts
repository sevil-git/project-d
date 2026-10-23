import media from './media.json'

export type Category = 'Posters' | 'Thumbnails' | 'Composites' | 'Food & lifestyle'
export type Variant = { width: number; height: number; format: string; url: string; bytes: number }
export type Media = { id: string; filename: string; sourceUrl: string; original: { width: number; height: number; bytes: number; sha256: string }; variants: Variant[] }
export type Artwork = { id: string; title: string; category: Category; description: string; alt: string; media: Media }

// Descriptive titles and groupings based on the supplied artwork, not commissioned project claims.
const catalogue: [keyof typeof media, string, Category, string, string][] = [
  ['flower', 'Kadupul', 'Posters', "A delicate flower. Some very loud type. Balance is a beautiful thing.", 'White Kadupul flower, green foliage and bold English and Devanagari typography on textured paper'],
  ['jett-tnn', 'Jett / Ghost Gaming', 'Thumbnails', "Ice-blue motion, a sharp silhouette, and absolutely no intention of blending in.", 'Jett from Valorant surrounded by blue motion effects and Ghost Gaming lettering'],
  ['minimal-og', 'Depth', 'Posters', "One portrait. One red accent. A lot of opinions about where the letters should go.", 'Black and white portrait with vertical Depth typography and red graphic accents'],
  ['ramen', 'Ramen', 'Food & lifestyle', "Warm yellow, oversized type, and a bowl doing most of the convincing. Please don’t lick the screen.", 'Ramen bowl and chopsticks against a warm yellow background with large orange lettering'],
  ['bantman1', 'The Batman', 'Posters', "Red. Black. Zero plans to lighten the mood. A poster study for Gotham’s most dramatic resident.", 'Black Batman silhouettes and a Gotham collage on a vivid red poster'],
  ['insta-pic', 'Freedom of thought', 'Composites', "A portrait that refuses to stay inside its box. Honestly, relatable.", 'Woman in a flower field stepping visually beyond a rounded frame with Freedom of thought typography'],
  ['arcane', 'Arcane / I', 'Posters', "The drama was already there. I just gave it borders, type, and a little room to breathe.", 'Dark Arcane collage combining character stills and fine editorial borders'],
  ['arcane1', 'Arcane / II', 'Posters', "Same world. Different emotional damage. Another carefully arranged excuse to revisit Arcane.", 'Second Arcane collage featuring blue and violet character stills'],
  ['jap2', 'Warrior / I', 'Posters', "A warrior, layered panels, and Japanese type. Quiet palette. Loud presence.", 'Armored warrior against cream and black graphic panels with red accents and Japanese type'],
  ['jap3', 'Warrior / II', 'Posters', "The warrior got another layout. Because sometimes one more version is actually a good idea.", 'Warrior figure in a cream, black and red Japanese-inspired poster layout'],
  ['bloom', 'Bloom', 'Posters', "Pink blossoms, a blue sky, and type that finally learned to give things space.", 'Pink flowering branches against a pale blue sky with large Bloom lettering'],
  ['f3', 'Veiled', 'Composites', "A classical portrait interrupted by flowers. Even a statue deserves a dramatic entrance.", 'Classical sculptural bust obscured by red flowers against a red background'],
  ['m3', 'Beneath the surface', 'Composites', "Somewhere between a portrait and a daydream. Water-like reflections do the talking.", 'Close-up portrait with green water-like reflections and small white typography'],
  ['s3t', 'Mindscape', 'Composites', "Head in the clouds, quite literally. A classical bust with a very active inner monologue.", 'Classical statue with clouds replacing the top of its head and vertical Mindscape lettering'],
  ['drow', 'Drowning', 'Posters', "A small figure. A lot of blue. Empty space with main-character energy.", 'Underwater figure suspended in a blue beam of light above large Drowning typography'],
  ['minimal2', 'Depth / alternate', 'Posters', "Same face. Softer volume. A lighter take on the Depth study.", 'Soft monochrome portrait with vertical Depth lettering and a fine red frame'],
  ['word', 'Until you win', 'Posters', "Motivational advice, delivered at a volume you can see.", 'Black and white portrait overlaid with Don’t give up until you win lettering'],
  ['deja', 'Your corner, your crunch', 'Food & lifestyle', "Food photography with a yellow headline that skipped the inside voice. Appetite: handled.", 'Sandwiches and iced drinks on a table with yellow Your corner your crunch lettering'],
  ['deja2', 'Eat your heart out', 'Food & lifestyle', "Warm light, big cravings, and type that knows when to let the food talk.", 'Plated food and drinks in a warmly lit interior with Eat your heart out typography'],
  ['clove-gtn', 'Clove / Ghost Gaming', 'Thumbnails', "Purple trails, oversized letters, and a main character who understood the assignment.", 'Clove from Valorant against purple motion graphics and white Valorant lettering'],
  ['iso-gtn1', 'Iso / electric', 'Thumbnails', "A violet power trip, in thumbnail form. Subtlety was not invited.", 'Iso from Valorant with electric violet effects and oversized white lettering'],
  ['isotn2', 'Iso / after dark', 'Thumbnails', "Same agent. Night mode. A darker layout for people who keep everything on low brightness.", 'Iso seated against a dark patterned background with Ghost Gaming and Valorant typography'],
  ['omentn', 'Omen', 'Thumbnails', "Purple shapes. A suspicious silhouette. Definitely up to something.", 'Omen from Valorant on a flat purple background with bold black typography'],
  ['reynaa', 'The hunt begins', 'Thumbnails', "Violet, magenta, and a look that says the warm-up is over.", 'Reyna from Valorant with purple and pink effects and The hunt begins lettering'],
  ['skyegtn1', 'Skye', 'Thumbnails', "Acid green with zero volume control. Skye was never going to blend into the feed.", 'Skye from Valorant in a lime green thumbnail with an inset blue portrait'],
  ['tn2', 'Neon / Ghost Gaming', 'Thumbnails', "Cyan light trails and a pose with places to be. There is a lot happening between the pixels.", 'Neon from Valorant with cyan light trails and Ghost Gaming lettering'],
  ['tncg', 'A little celebration', 'Thumbnails', "A little gift. A big thank-you. Even gaming graphics get to have a wholesome moment.", 'Reyna holding a small gift in a purple thumbnail with a thank-you message'],
  ['tnteam', 'When agents meet Pokémon', 'Thumbnails', "Two gaming worlds walk into one thumbnail. Things get interesting.", 'Valorant characters in a warm-toned scene with When Agents Meet Pokémon lettering'],
  ['vyse1', 'Insta-lock disaster', 'Thumbnails', "A yellow-and-black warning label for some highly questionable in-game decisions.", 'Vyse from Valorant in a yellow and black gaming thumbnail'],
  ['premier', 'Premier', 'Thumbnails', "Gold accents, a dark stage, and a team that looks ready for the opening credits.", 'Valorant characters and a gold Premier emblem on a dark cinematic background'],
  ['1k-reyna', 'One thousand', 'Thumbnails', "A milestone deserves more than a tiny notification. Cue the big type and bigger reaction.", 'Reyna reacting beside white milestone lettering and a green rank emblem'],
  ['gw', 'Giveaway / I', 'Thumbnails', "Cool green. Big giveaway energy. A social graphic with no interest in being missed.", 'Valorant giveaway graphic with teal characters and large serif Giveaway lettering'],
  ['gw11', 'Giveaway / II', 'Thumbnails', "The giveaway graphic found dark mode. Same occasion, moodier entrance.", 'Dark blue Valorant giveaway artwork with a central character and white event typography'],
]

export const artworks: Artwork[] = catalogue.map(([id, title, category, description, alt]) => ({ id, title, category, description, alt, media: media[id] }))
export const categories = ['All work', 'Posters', 'Thumbnails', 'Composites', 'Food & lifestyle'] as const
export const getArtwork = (id: string) => artworks.find(art => art.id === id) ?? artworks[0]

// An opening art study: portrait typography, reflected light, then ink and armor.
export const introArtworks = ['minimal2', 'm3', 'jap3'].map(getArtwork)
// Six fullscreen studies; only the last three become persistent cards in the strip.
export const loadingArtworks = ['flower', 'f3', 'minimal-og', ...introArtworks.map(art => art.id)].map(getArtwork)

// These distinct featured pieces continue the same thumbnail sequence after the opening studies.
export const cinemaArtworks = ['jap2', 'flower', 'minimal-og', 's3t', 'f3', 'arcane', 'bantman1', 'drow'].map(getArtwork)
