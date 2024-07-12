"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  HiHome,
  HiUsers,
  HiFolder,
  HiChat,
  HiBell,
  HiVideoCamera,
  HiUser,
  HiMap,
  HiStar,
} from "react-icons/hi";
import { Menu } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";

const SHEET_SIDES = ["left"] as const;

type SheetSide = (typeof SHEET_SIDES)[number];

const navItems = [
  { name: "Home", icon: HiHome, href: "/" },
  { name: "Following", icon: HiUsers, href: "/following" },
  { name: "Repository", icon: HiFolder, href: "/repository" },
  { name: "Chat & Call", icon: HiChat, href: "/chat-call" },
  { name: "Notifications", icon: HiBell, href: "/notifications" },
  { name: "Meeting", icon: HiVideoCamera, href: "/meeting" },
  { name: "Profile", icon: HiUser, href: "/profile" },
  { name: "Create Roadmap", icon: HiMap, href: "/create-roadmap" },
  { name: "Favourites & Roadmaps", icon: HiStar, href: "/favourites-roadmaps" },
];

export function Hamburger() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div>
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Menu className="text-3xl m-2 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
          </SheetTrigger>
          <SheetContent
            side={side}
            className={`bg-gradient-to-br from-white to-blue-50 ${
              isDarkMode && " from-gray-900 to-gray-800"
            } w-74 p-0`}
          >
            <SheetHeader
              className={`text-white p-6 shadow-md ${
                isDarkMode && "bg-gray-800"
              }`}
            >
              <SheetTitle
                className={`text-2xl font-bold text-gray-800 ${
                  isDarkMode && "text-blue-400"
                }`}
              >
                KnowledgeLink
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-4 px-4">
              {navItems.map((item, index) => (
                <Link key={index} href={item.href} passHref>
                  <div
                    className={`flex items-center p-3 mb-2 rounded-lg hover:bg-blue-100 ${
                      isDarkMode && "hover:bg-gray-700"
                    } transition-all duration-200 cursor-pointer group`}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 text-gray-500 group-hover:text-blue-800 ${
                        isDarkMode && "text-gray-400 group-hover:text-blue-400"
                      } transition-colors duration-200`}
                    />
                    <span
                      className={`text-gray-500  group-hover:text-blue-800 ${
                        isDarkMode && "text-gray-300 group-hover:text-blue-400"
                      } font-medium transition-colors duration-200`}
                    >
                      {item.name}
                    </span>
                  </div>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
