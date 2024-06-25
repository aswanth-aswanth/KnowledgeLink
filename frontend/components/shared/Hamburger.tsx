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
  HiOutlineMenuAlt2,
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
  return (
    <div>
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <HiOutlineMenuAlt2 className="text-3xl m-2 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
          </SheetTrigger>
          <SheetContent
            side={side}
            className="bg-gradient-to-br from-white to-blue-50 w-74 p-0"
          >
            <SheetHeader className="text-white p-6 shadow-md">
              <SheetTitle className="text-2xl font-bold text-gray-800">
                KnowledgeLink
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-4 px-4">
              {navItems.map((item, index) => (
                <Link key={index} href={item.href} passHref>
                  <div className="flex items-center p-3 mb-2 rounded-lg hover:bg-blue-100 transition-all duration-200 cursor-pointer group">
                    <item.icon className="mr-4 h-6 w-6 text-gray-500 group-hover:text-blue-800 transition-colors duration-200" />
                    <span className="text-gray-500 group-hover:text-blue-800 font-medium transition-colors duration-200">
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
