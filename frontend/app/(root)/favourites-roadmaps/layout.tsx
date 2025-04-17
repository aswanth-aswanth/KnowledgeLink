'use client';

import React from 'react';
import { ReduxProvider } from '@/lib/redux-provider';
import { checkTokenExpiration } from '@/redux/auth/auth.slice';
import { store } from '@/redux';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    store.dispatch(checkTokenExpiration());
  }, []);

  return (
    <ReduxProvider>
      <LayoutContent>{children}</LayoutContent>
    </ReduxProvider>
  );
};

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="-mt-[80px]">{children}</div>
    </>
  );
};

export default RootLayout;
