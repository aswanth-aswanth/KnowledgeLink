import { Bell, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/useDarkMode";

export function TopBar({ children }: { children?: React.ReactNode }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  console.log("isDarkMode : ",isDarkMode);
  return (
    <header className="h-16 flex items-center justify-between px-4 border-b bg-background">
      <div className="flex items-center">
        {children}
        <h2 className="text-xl font-semibold">Welcome, Admin</h2>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
