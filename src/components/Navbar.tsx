// /Users/sahil/Documents/GitHub/project-d/src/components/Navbar.tsx
import React from 'react';

interface NavbarProps {
  
}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav className="flex font-poppins fixed top-0 left-0 z-[1] w-full items-center justify-between p-4">
      <div className="font-bold text-xl">
        Project D
      </div>
      <div className="cursor-pointer text-2xl">
        &#9776; {/* Hamburger icon */}
      </div>
    </nav>
  );
};

export default Navbar;