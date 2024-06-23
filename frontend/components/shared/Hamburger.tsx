"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  HiOutlineMenuAlt2,
  HiHome,
  HiUsers,
  HiFolder,
  HiChat,
  HiBell,
  HiVideoCamera,
  HiUser,
  HiMap,
  HiStar
} from "react-icons/hi";

const SHEET_SIDES = ["left"] as const;

type SheetSide = (typeof SHEET_SIDES)[number];

const navItems = [
  { name: "Home", icon: HiHome },
  { name: "Following", icon: HiUsers },
  { name: "Repository", icon: HiFolder },
  { name: "Chat & Call", icon: HiChat },
  { name: "Notifications", icon: HiBell },
  { name: "Meeting", icon: HiVideoCamera },
  { name: "Profile", icon: HiUser },
  { name: "Create Roadmap", icon: HiMap },
  { name: "Favourites & Roadmaps", icon: HiStar },
];

export function Hamburger() {
  return (
    <div>
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <HiOutlineMenuAlt2 className="text-3xl m-2 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
          </SheetTrigger>
          <SheetContent side={side} className="bg-gradient-to-br from-white to-blue-50 w-74 p-0">
            <SheetHeader className="text-white p-6 shadow-md">
              <SheetTitle className="text-2xl font-bold text-gray-800">KnowledgeLink</SheetTitle>
            </SheetHeader>
            <nav className="mt-4 px-4">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 mb-2 rounded-lg hover:bg-blue-100 transition-all duration-200 cursor-pointer group"
                >
                  <item.icon className="mr-4 h-6 w-6 text-gray-500 group-hover:text-blue-800 transition-colors duration-200" />
                  <span className="text-gray-500 group-hover:text-blue-800 font-medium transition-colors duration-200">
                    {item.name}
                  </span>
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}