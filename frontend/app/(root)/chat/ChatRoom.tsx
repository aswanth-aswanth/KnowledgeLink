import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ProfileSection from "./ProfileSection";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function ChatRoom() {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`flex h-screen max-h-[91.8vh] ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <Sidebar isDarkMode={isDarkMode} />
      <div className="flex-1 flex flex-col">
        <ChatWindow isDarkMode={isDarkMode} />
      </div>
      <ProfileSection isDarkMode={isDarkMode} />
    </div>
  );
}
