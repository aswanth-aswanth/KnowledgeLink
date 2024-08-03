// components/Sidebar.tsx
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  LayoutDashboard,
  Users,
  Settings,
  BarChart,
} from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";

const navItems = [
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
    subItems: [{ title: "View All Users", href: "/admin/users/userlist" }],
  },
  {
    title: "Roadmaps",
    icon: Users,
    href: "/admin/roadmaps",
    subItems: [{ title: "View All Roadmaps", href: "/admin/roadmaps" }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { isDarkMode } = useDarkMode();

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <aside
      className={cn(
        "w-64 h-screen overflow-y-auto py-4 px-3 bg-background border-r",
        isDarkMode ? "border-gray-800" : "border-gray-200"
      )}
    >
      <div className="mb-5 px-2">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <nav>
        {navItems.map((item) => (
          <div key={item.title} className="mb-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal",
                pathname === item.href && "bg-accent"
              )}
              onClick={() => item.subItems && toggleSubmenu(item.title)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
              {item.subItems && (
                <ChevronDown
                  className={cn(
                    "ml-auto h-4 w-4 transition-transform duration-200",
                    openSubmenu === item.title && "transform rotate-180"
                  )}
                />
              )}
            </Button>
            {item.subItems && openSubmenu === item.title && (
              <div className="ml-4 mt-2 space-y-1">
                {item.subItems.map((subItem) => (
                  <Link key={subItem.href} href={subItem.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        pathname === subItem.href &&
                          "bg-accent dark:text-blue-300"
                      )}
                    >
                      {subItem.title}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
