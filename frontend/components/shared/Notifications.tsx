import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GoBell } from "react-icons/go";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import apiClient from "@/api/apiClient";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Notification } from "@/types/notificationTypes";

export default function NotificationPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    open && fetchNotifications();
  }, [open]);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient<{ notifications: Notification[] }>(
        "/notification"
      );
      console.log("Notifications : ", response.data);
      const sortedNotifications = response.data?.notifications?.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      console.count("MarkAsRead ");
      await apiClient.patch("/notification/mark-read", { notificationIds });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notificationIds.includes(notification._id)
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  useEffect(() => {
    if (open && notifications?.length > 0) {
      const unreadNotifications = notifications
        ?.filter((n) => !n.read)
        .map((n) => n._id);
      if (unreadNotifications?.length > 0) {
        markAsRead(unreadNotifications);
      }
    }
  }, [open, notifications]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`p-2 sm:p-4 outline-none border-none relative ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-white hover:bg-gray-100"
          } transition duration-300 ease-in-out`}
        >
          <GoBell
            className={`text-xl ${
              isDarkMode ? "text-gray-200" : "text-gray-600"
            }`}
          />
          {notifications?.filter((n) => !n.read)?.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications?.filter((n) => !n.read)?.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`w-96 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-0 rounded-lg shadow-xl`}
      >
        <div
          className={`p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h4
            className={`font-medium text-lg ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Notifications
          </h4>
        </div>
        <ScrollArea className="h-[400px] w-full rounded-md">
          {notifications?.length > 0 ? (
            <>
              {notifications?.slice(0, displayCount).map((notification) => (
                <div
                  key={notification?._id}
                  className={`p-4 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } 
                    ${
                      notification.read
                        ? isDarkMode
                          ? "bg-gray-800"
                          : "bg-white"
                        : isDarkMode
                        ? "bg-blue-900"
                        : "bg-blue-50"
                    } transition duration-300 ease-in-out hover:${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center 
                      ${
                        notification.type === "like"
                          ? isDarkMode
                            ? "bg-red-900 text-red-200"
                            : "bg-red-100 text-red-600"
                          : isDarkMode
                          ? "bg-blue-900 text-blue-200"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <span className="text-xl">
                        {notification.type === "like" ? "❤️" : "💬"}
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {notification.content}
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } mt-1`}
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                        ${
                          isDarkMode
                            ? "bg-green-800 text-green-100"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        New
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {displayCount < notifications.length && (
                <div className="p-4 text-center">
                  <Button
                    onClick={() =>
                      setDisplayCount((prevCount) => prevCount + 5)
                    }
                    className={`${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                    } transition duration-300 ease-in-out`}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } p-4`}
            >
              No notifications
            </p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
