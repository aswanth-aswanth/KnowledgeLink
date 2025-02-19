// components/FollowList.tsx
import React from 'react';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';

interface FollowUser {
  _id: string;
  username: string;
  email: string;
  image: string;
}

interface FollowListProps {
  users: FollowUser[];
  onClose: () => void;
}

const FollowList: React.FC<FollowListProps> = ({ users, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-50 dark:bg-black dark:bg-opacity-50">
      <div className="relative w-full max-w-md p-6 rounded-lg shadow-lg bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <div className="max-h-96 overflow-y-auto">
          {users.map((user) => (
            <div key={user._id} className="flex items-center mb-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" />
              )}
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowList;
