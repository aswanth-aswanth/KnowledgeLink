'use client';

import { useEffect, useState } from 'react';
import { getNotifications } from '@/api';
import { Notification } from '@/types/notifications';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [displayCount, setDisplayCount] = useState(10);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      const sortedNotifications = response.notifications?.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const loadMore = () => {
    setDisplayCount((prevCount) => prevCount + 10);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Notifications
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          {notifications.slice(0, displayCount).map((notification) => (
            <div
              key={notification._id}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                      notification.type === 'like'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                    }`}
                  >
                    <span className="text-2xl">
                      {notification.type === 'like' ? '❤️' : '💬'}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {notification.content}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="ml-2 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        New
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {displayCount < notifications.length && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Load More Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
