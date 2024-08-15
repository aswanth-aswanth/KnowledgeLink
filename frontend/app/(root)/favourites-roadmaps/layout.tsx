'use client';

import React from 'react';
import { ReduxProvider } from '@/lib/redux-provider';
import { checkTokenExpiration } from '@/store/authSlice';
import { store } from '@/store';

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
