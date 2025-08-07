// src/App.tsx
import React from "react";
import "./App.css";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import LoadingAnimation from "./components/LoadingAnimation";
import { useState } from "react";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full">
      <Navbar />
      <div className={`relative ${isLoading ? "overflow-hidden" : ""} h-full`}>
      {/* <div> */}
        <LoadingAnimation setIsLoading={setIsLoading} />

        <HeroSection />
        {/* Section 2 */}
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center text-black z-20">
            <h1 className="text-6xl font-bold mb-4">Section 3</h1>
            <p className="text-xl">The black div moves to center here</p>
          </div>
        </section>
        {/* Section 3 */}
        <section className="h-screen flex items-center justify-center">
          <div className="text-center text-black">
            <h1 className="text-6xl font-bold mb-4">Section 4</h1>
            <p className="text-xl">This section scrolls normally</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
