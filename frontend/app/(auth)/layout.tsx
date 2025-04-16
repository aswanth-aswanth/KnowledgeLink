'use client';
import React from 'react';
import { ReduxProvider } from '@/lib/redux-provider';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider>
      <div>{children}</div>
    </ReduxProvider>
  );
};

export default RootLayout;
