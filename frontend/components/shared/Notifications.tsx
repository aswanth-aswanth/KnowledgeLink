import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GoBell } from 'react-icons/go';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Notification } from '@/types/NotificationTypes';
import {
  getNotifications,
  getNotificationCount,
  markNotificationsAsRead,
} from '@/api';

export default function NotificationPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const [totalMessages, setTotalMessages] = useState(5);
  const [newlyDisplayedIds, setNewlyDisplayedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchNotificationCount();
    open && fetchNotifications();
  }, [open]);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      const sortedNotifications = response?.notifications?.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sortedNotifications);

      // Identify newly displayed unread notifications
      const newIds = sortedNotifications
        .filter((notification: Notification) => !notification.read)
        .map((notification: Notification) => notification._id);
      setNewlyDisplayedIds(newIds);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const response = await getNotificationCount();
      setDisplayCount(response.unReadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const sendMarkAsRead = async () => {
    if (newlyDisplayedIds.length === 0) return;

    try {
      // Assuming you have an API function to mark notifications as read
      await markNotificationsAsRead(newlyDisplayedIds);

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          newlyDisplayedIds.includes(notification._id)
            ? { ...notification, read: true }
            : notification
        )
      );

      // Clear the newly displayed IDs
      setNewlyDisplayedIds([]);

      // Update the notification count
      fetchNotificationCount();
    } catch (error) {
      console.log('Error marking notifications as read:', error);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          sendMarkAsRead();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="p-2 outline-none border-none relative rounded-full dark:hover:bg-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out"
        >
          <GoBell className="text-xl bg-transparent dark:text-gray-200 text-gray-600" />
          {displayCount && displayCount != 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {displayCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 bg-white dark:bg-gray-800 p-0 rounded-lg shadow-xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-lg text-gray-900 dark:text-white">
            Notifications
          </h4>
        </div>
        <ScrollArea className="h-[400px] w-full rounded-md">
          {notifications?.length > 0 ? (
            <>
              {notifications?.slice(0, totalMessages).map((notification) => (
                <div
                  key={notification?._id}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
                    notification.read
                      ? 'bg-white dark:bg-gray-800'
                      : 'bg-blue-50 dark:bg-blue-900'
                  } transition duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700`}
                >
                  <div className="flex items-start">
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        notification.type === 'like'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                      }`}
                    >
                      <span className="text-xl">
                        {notification.type === 'like' ? '❤️' : '💬'}
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        New
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {totalMessages < notifications.length && (
                <div className="p-4 text-center">
                  <Button
                    onClick={() =>
                      setTotalMessages((prevCount) => prevCount + 5)
                    }
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white transition duration-300 ease-in-out"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 p-4">
              No notifications
            </p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
