import React, { useEffect } from 'react';
import { FiSearch, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuthState, checkTokenExpiration } from '@/store/authSlice';
import { selectAuthState } from '@/store/selectors';
import { Hamburger } from './Hamburger';
import Notifications from '@/components/shared/Notifications';
import Image from 'next/image';
import defaultUserImage from '@/public/defaultUserImage.png';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import apiClient from '@/api/apiClient';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function Header() {
  const { isAuthenticated, user } = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(checkTokenExpiration());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      dispatch(clearAuthState());
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="flex items-center justify-between p-2 relative z-50 max-w-[100vw] overflow-hidden shadow-md bg-header text-text">
      <div className="flex items-center">
        <Hamburger />
        <div className="flex-grow mx-2 sm:mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 pl-10 pr-4 max-w-full rounded-xl focus:outline-none focus:ring-2 focus:shadow-outline text-gray-700 bg-gray-100 focus:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:focus:bg-gray-600 dark:focus:ring-blue-400"
            />
            <FiSearch className="absolute top-3 left-3 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4 mr-2 sm:mr-10">
        <ThemeSwitcher />
        <Notifications />
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Image
                  src={user.imageUrl || defaultUserImage}
                  alt="User Image"
                  className="w-[30px] h-[30px] rounded-full max-w-max cursor-pointer"
                  width={32}
                  height={32}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem
                onClick={() => router.push('/profile')}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiUser className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push('/settings')}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiSettings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiLogOut className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-900 dark:text-white">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div
            className="hover:bg-gray-200 dark:hover:bg-gray-600 p-2 cursor-pointer rounded-full"
            onClick={() => router.push('/sign-in')}
          >
            <FiUser className="text-2xl rounded-full" />
          </div>
        )}
      </div>
    </header>
  );
}
