import React from "react";
import { FiAlignJustify, FiSearch, FiUser } from "react-icons/fi";
import { GoBell } from "react-icons/go";
import { Hamburger } from "./Hamburger";
import Notifications from "./Notifications";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 relative z-10 bg-white shadow-md">
      <div className="flex items-center">
        {/* <FiAlignJustify className="text-2xl cursor-pointer" /> */}
        <Hamburger />
      </div>

      <div className="flex-grow mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-4 max-w-5xl text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:bg-gray-200 focus:shadow-outline"
          />
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-4 md:mr-10">
      <Notifications />

        {/* <GoBell className="text-2xl cursor-pointer" /> */}
        <FiUser className="text-2xl cursor-pointer" />
      </div>
    </header>
  );
}
