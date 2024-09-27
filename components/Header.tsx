// components/Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 shadow-md fixed top-0 z-50">
      <div className="max-w-screen-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-center">Joystream Shorts</h1>
      </div>
    </header>
  );
};

export default Header;
