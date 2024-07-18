"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode } = useDarkMode();
  console.log("IsDark layout : ", isDarkMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div
      className={cn(
        "flex h-screen",
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      )}
    >
      <div
        className={cn(
          "fixed inset-y-0 left-0 transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0 transition duration-200 ease-in-out z-30",
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        )}
      >
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden",
              isDarkMode
                ? "text-white hover:bg-gray-700"
                : "text-gray-900 hover:bg-gray-200"
            )}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </TopBar>
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4",
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          )}
        >
          {children}
        </main>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
