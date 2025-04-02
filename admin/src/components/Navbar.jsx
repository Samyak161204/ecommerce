import React from 'react';
import { assets } from '../assets/assets';

const Navbar = ({ onLogout }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between bg-white shadow-md">
      {/* Logo */}
      <img className="h-10 sm:h-12 w-auto" src={assets.logo} alt="Logo" />

      {/* Logout Button */}
      <button
        onClick={onLogout}
        aria-label="Logout"
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm 
                   hover:bg-gray-700 transition duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
