// layout.tsx
"use client";

import React from "react";
import Header from "@/components/shared/Header";
import { ReduxProvider } from "@/lib/redux-provider";
import { checkTokenExpiration } from "@/store/authSlice";
import { store } from "@/store";
import { useDarkMode } from "@/hooks/useDarkMode";

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
  const { isDarkMode } = useDarkMode();

  return (
    <>
      <Header />
      <main className={`${isDarkMode && "bg-gray-900"} min-h-[91vh]`}>
        <div className="max-w-[1224px] px-4 md:px-0 mx-auto">{children}</div>
      </main>
    </>
  );
};

export default RootLayout;
