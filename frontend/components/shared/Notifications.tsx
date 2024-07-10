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

interface Notification {
  _id: string;
  type: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

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
          className="p-2 sm:p-4 outline-none border-none relative"
        >
          <GoBell className="text-xl" />
          {notifications?.filter((n) => !n.read)?.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications?.filter((n) => !n.read)?.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
          </div>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {notifications?.length > 0 ? (
              notifications?.map((notification) => (
                <div
                  key={notification?._id}
                  className={`mb-4 p-3 rounded-lg ${
                    notification.read ? "bg-gray-100" : "bg-blue-100"
                  }`}
                >
                  <h5 className="font-semibold text-sm">{notification.type}</h5>
                  <p className="text-sm text-gray-600">
                    {notification.content}
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No notifications</p>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
