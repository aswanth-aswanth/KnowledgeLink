"use client";

import React from "react";
import Header from "@/components/shared/Header";
import { ReduxProvider } from "@/lib/redux-provider";
import { checkTokenExpiration } from "@/store/authSlice";
import { store } from "@/store";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useNotifications } from "@/hooks/useNotifications";
import { selectAuthState } from "@/store/authSlice";
import { useSelector } from "react-redux";

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
  const { isAuthenticated, user } = useSelector(selectAuthState);
  const userEmail = user?.email;
  console.log("UserEmail : ", userEmail);
  useNotifications(
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5004",
    userEmail
  );

  return (
    <>
      <Header />
      <main
        className={`${
          isDarkMode && "bg-gray-900 dark"
        } min-h-screen overflow-hidden px-3 sm:px-4 md:px-5`}
      >
        <div className="max-w-[1224px] px-0 sm:px-4 md:px-0 mx-auto">
          {children}
        </div>
      </main>
    </>
  );
};

export default RootLayout;
