import React, { useEffect } from "react";
import { FiSearch, FiUser, FiSun, FiMoon } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAuthState,
  clearAuthState,
  checkTokenExpiration,
} from "@/store/authSlice";
import { Hamburger } from "./Hamburger";
import Notifications from "./Notifications";
import Image from "next/image";
import defaultUserImage from "@/public/defaultUserImage.png";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function Header() {
  const { isAuthenticated, user } = useSelector(selectAuthState);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(checkTokenExpiration());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(clearAuthState());
  };

  return (
    <header
      className={`flex items-center justify-between p-2 relative z-10 max-w-[100vw] overflow-hidden shadow-md ${
        isDarkMode
          ? "bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg text-white"
          : "bg-white"
      }`}
    >
      <div className="flex items-center">
        <Hamburger />
      </div>

      <div className="flex-grow mx-2 sm:mx-4 max-[420px]:max-w-[110px] ">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className={`w-full py-2 pl-10 pr-4 max-w-full rounded-xl focus:outline-none focus:ring-2 focus:shadow-outline ${
              isDarkMode
                ? "text-gray-200 bg-gray-700 focus:bg-gray-600 focus:ring-blue-400"
                : "text-gray-700 bg-gray-100 focus:bg-gray-200"
            }`}
          />
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 mr-2 sm:mr-10">
        <button
          onClick={toggleDarkMode}
          className="p-2 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label={
            isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
        >
          {isDarkMode ? (
            <FiSun className="w-5 h-5 text-yellow-400" />
          ) : (
            <FiMoon className="w-5 h-5 text-gray-700" />
          )}
        </button>
        <Notifications />

        {isAuthenticated && user ? (
          <div className="flex items-center p-0 sm:p-2 shrink-0">
            <span className="text-gray-500 hidden sm:block font-medium mr-2">
              {user.name}
            </span>
            <Image
              src={user.imageUrl || defaultUserImage}
              alt="User Image"
              className="w-8 h-8 rounded-full cursor-pointer"
              width={32}
              height={32}
              onClick={handleLogout}
            />
          </div>
        ) : (
          <div
            className="hover:bg-gray-100 p-2 cursor-pointer rounded-full"
            onClick={() => router.push("/sign-in")}
          >
            <FiUser className="text-2xl rounded-full" />
          </div>
        )}
      </div>
    </header>
  );
}
