import { Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useDispatch } from "react-redux";
import { clearAuthState } from "@/store/authSlice";

export function TopBar({ children }: { children?: React.ReactNode }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  console.log("isDarkMode : ", isDarkMode);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearAuthState());
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 border-b bg-background">
      <div className="flex items-center">
        {children}
        <h2 className="text-xl font-semibold">Welcome, Admin</h2>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Button onClick={handleLogout} variant="ghost" size="icon">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
