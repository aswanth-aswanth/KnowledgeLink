import React, { useEffect } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
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

export default function Header() {
  const { isAuthenticated, user } = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(checkTokenExpiration());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(clearAuthState());
  };

  return (
    <header className="flex items-center justify-between p-2 relative z-10 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg border-b border-gray-600">
      <div className="flex items-center">
        <Hamburger />
      </div>

      <div className="flex-grow mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-4 max-w-5xl text-gray-200 bg-gray-700 rounded-xl focus:outline-none focus:bg-gray-600 focus:ring-2 focus:ring-blue-400 transition-all duration-200 placeholder-gray-400"
          />
          <FiSearch className="absolute top-3 left-3 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-4 md:mr-10">
        <Notifications />

        {isAuthenticated && user ? (
          <div className="flex items-center">
            <span className="text-gray-200 font-medium mr-2">{user.name}</span>
            <Image
              src={user.imageUrl || defaultUserImage}
              alt="User Image"
              className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-gray-500 hover:ring-blue-400 transition-all duration-200"
              width={32}
              height={32}
              onClick={handleLogout}
            />
          </div>
        ) : (
          <FiUser
            className="text-2xl cursor-pointer text-gray-200 hover:text-blue-400 transition-colors duration-200"
            onClick={() => router.push("/sign-in")}
          />
        )}
      </div>
    </header>
  );
}