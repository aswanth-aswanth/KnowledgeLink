'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layouts/Header';
import { ReduxProvider } from '@/lib/redux-provider';
import { checkTokenExpiration, selectAuthState } from '@/store/authSlice';
import { store, AppDispatch } from '@/store';
import { useNotifications } from '@/hooks/useNotifications';
import { useSelector, useDispatch } from 'react-redux';
import { initializeSocket } from '@/store/socketSlice';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    store.dispatch(checkTokenExpiration());
  }, []);

  return (
    <ReduxProvider>
      <LayoutContent>{children}</LayoutContent>
    </ReduxProvider>
  );
};

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, token, isAuthenticated } = useSelector(selectAuthState);
  const dispatch = useDispatch<AppDispatch>();
  const userEmail = user?.email;
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(initializeSocket(token));
    }
  }, [isAuthenticated, token, dispatch]);

  useNotifications('https://backend.aswanth.online', userEmail as string);

  const isChatPage = pathname === '/chat';

  return (
    <div className={'flex flex-col min-h-screen bg-background'}>
      <div className={`${isChatPage && 'hidden md:block'}`}>
        <Header />
      </div>
      <main
        className={`flex-grow overflow-y-auto sm:px-4 md:px-5 ${
          !isChatPage ? 'px-2' : ''
        }`}
      >
        <div
          className={`${
            !isChatPage ? 'max-w-[1224px] px-0 sm:px-4 md:px-0 mx-auto' : ''
          } h-full`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
