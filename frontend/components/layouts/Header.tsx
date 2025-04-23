import React from 'react';
import { FiSearch, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { logoutUser } from '@/redux/auth/auth.slice';
import { selectAuthState } from '@/redux/auth/auth.selectors';
import { Hamburger } from './Hamburger';
import Notifications from '@/components/shared/Notifications';
import { useRouter } from 'next/navigation';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import Image from 'next/image';
import defaultUserImage from '@/public/defaultUserImage.png';
import ConfigurableDropdown, {
  DropdownItem,
} from '@/components/shared/ConfigurableDropdown';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/useRedux';

export default function Header() {
  const { isAuthenticated, user } = useSelector(selectAuthState);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    dispatch(logoutUser());
  };

  const dropdownItems: DropdownItem[] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: (
        <FiUser className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
      ),
      onClick: () => router.push('/profile'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: (
        <FiSettings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
      ),
      onClick: () => router.push('/settings'),
      separator: true,
    },
    {
      key: 'logout',
      label: 'Log out',
      icon: (
        <FiLogOut className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
      ),
      onClick: handleLogout,
    },
  ];

  const dropdownTrigger = (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Image
        src={user?.imageUrl || defaultUserImage}
        alt="User Image"
        className="w-[30px] h-[30px] rounded-full max-w-max cursor-pointer"
        width={32}
        height={32}
      />
    </Button>
  );

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
          <ConfigurableDropdown
            items={dropdownItems}
            trigger={dropdownTrigger}
            align="end"
          />
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
