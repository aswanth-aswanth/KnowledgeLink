// layout.tsx
"use client";

import React from "react";
import Header from "@/components/layouts/Header";
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
      {/* <main className={`${isDarkMode && "bg-gray-900"} -mt-[80px]`}> */}
      <div className="-mt-[80px]">{children}</div>
      {/* </main> */}
    </>
  );
};

export default RootLayout;
