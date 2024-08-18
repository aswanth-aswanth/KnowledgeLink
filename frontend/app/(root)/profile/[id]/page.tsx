'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaUsers, FaNewspaper } from 'react-icons/fa';
import { useDarkMode } from '@/hooks/useDarkMode';
import { usePathname } from 'next/navigation';
import { PostFeed } from './PostFeed';
import {
  getUserProfile,
  followUser,
  getFollowers,
  getFollowings,
} from '@/api/userApi';
import FollowList from './FollowList';
import { getUserPosts } from '@/api/postApi';
import { User } from '@/types/userTypes';
import { Post } from '@/types/postTypes';

// Define an interface for TabButton props
interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  isDarkMode: boolean;
}

export default function Profile() {
  const { isDarkMode } = useDarkMode();
  const pathname = usePathname();
  const [user, setUser] = useState<User>({});
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    'Profile' | 'Posts' | 'Groups'
  >('Profile');
  const [showFollowList, setShowFollowList] = useState(false);
  const [followListType, setFollowListType] = useState<
    'followers' | 'following' | null
  >(null);

  const [followList, setFollowList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = pathname.split('/')[2];
        const profile = await getUserProfile(userId);
        setUser(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchData();
  }, [pathname]);

  const handleFollowUser = async () => {
    try {
      const userId = pathname.split('/')[2];
      const res = await followUser(userId);

      setUser((prevUser: any) => {
        const newFollowingCount = res.following
          ? prevUser.followersCount + 1
          : prevUser.followersCount - 1;

        return {
          ...prevUser,
          isFollowing: res.following,
          followersCount: newFollowingCount,
        };
      });
    } catch (error) {
      console.log('Error following user:', error);
    }
  };

  const handleShowFollowList = async (type: 'followers' | 'following') => {
    setFollowListType(type);
    setShowFollowList(true);
    const userId = pathname.split('/')[2];
    try {
      const data =
        type === 'followers'
          ? await getFollowers(userId)
          : await getFollowings(userId);
      setFollowList(data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div
        className={`h-48 sm:h-64 ${
          isDarkMode
            ? 'bg-teal-900'
            : 'bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500'
        }`}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 sm:-mt-32 mb-8">
          <div
            className={`rounded-full mx-auto w-32 h-32 sm:w-40 sm:h-40 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } p-2 overflow-hidden shadow-lg`}
          >
            {user?.image ? (
              <div className="relative w-full h-full">
                <Image
                  src={user.image}
                  layout="fill"
                  objectFit="cover"
                  alt="Profile Picture"
                  className="rounded-full"
                />
              </div>
            ) : (
              <FaUserCircle className="w-full h-full text-gray-400" />
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <h1
            className={`text-2xl sm:text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}
          >
            {user?.username}
          </h1>
          <p
            className={`text-sm sm:text-base ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {user?.email}
          </p>
          <button
            onClick={handleFollowUser}
            className={`mt-4 px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
              user?.isFollowing
                ? isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : isDarkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {user?.isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <div
            className="text-center cursor-pointer"
            onClick={() => handleShowFollowList('followers')}
          >
            <p className="text-2xl font-bold">{user?.followersCount}</p>
            <p
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Followers
            </p>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={() => handleShowFollowList('following')}
          >
            <p className="text-2xl font-bold">{user?.followingCount}</p>
            <p
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Following
            </p>
          </div>
          <div className="text-center w-16">
            <p className="text-2xl font-bold">{posts.length}</p>
            <p
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Posts
            </p>
          </div>
        </div>

        <div
          className={`flex justify-center mb-8 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-300'
          }`}
        >
          <TabButton
            icon={<FaUserCircle />}
            label="Profile"
            isSelected={selectedTab === 'Profile'}
            onClick={() => setSelectedTab('Profile')}
            isDarkMode={isDarkMode}
          />
          <TabButton
            icon={<FaNewspaper />}
            label="Posts"
            isSelected={selectedTab === 'Posts'}
            onClick={() => setSelectedTab('Posts')}
            isDarkMode={isDarkMode}
          />
          <TabButton
            icon={<FaUsers />}
            label="Groups"
            isSelected={selectedTab === 'Groups'}
            onClick={() => setSelectedTab('Groups')}
            isDarkMode={isDarkMode}
          />
        </div>

        <div
          className={`bg-opacity-50 rounded-lg mb-10 p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          {selectedTab === 'Profile' && (
            <div>
              <h3 className="font-bold text-xl mb-4">About</h3>
              <p
                className={`leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti nisi deleniti sunt dignissimos quam unde hic placeat
                veniam itaque incidunt nulla vero fugit culpa, praesentium
                inventore sequi sapiente quia sed. Lorem ipsum dolor sit amet,
                consectetur adipisicing elit. Itaque ut quia, iure, quis optio,
                voluptas ipsa magnam dicta beatae mollitia aperiam velit totam
                ipsam ullam assumenda eius? Aliquam, explicabo nemo.
              </p>
            </div>
          )}
          {selectedTab === 'Posts' && (
            <div>
              <h3 className="font-bold text-xl mb-4">Posts</h3>
              <PostFeed />
            </div>
          )}
          {selectedTab === 'Groups' && (
            <div>
              <h3 className="font-bold text-xl mb-4">Groups</h3>
              {/* Groups content */}
            </div>
          )}
        </div>
      </div>
      {showFollowList && (
        <FollowList
          users={followList}
          isDarkMode={isDarkMode}
          onClose={() => setShowFollowList(false)}
        />
      )}
    </div>
  );
}

const TabButton: React.FC<TabButtonProps> = ({
  icon,
  label,
  isSelected,
  onClick,
  isDarkMode,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 border-b-2 transition-colors duration-300 ${
      isSelected
        ? isDarkMode
          ? 'border-blue-500 text-blue-500'
          : 'border-blue-600 text-blue-600'
        : isDarkMode
        ? 'border-transparent text-gray-400 hover:text-gray-200'
        : 'border-transparent text-gray-600 hover:text-gray-800'
    }`}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
);
