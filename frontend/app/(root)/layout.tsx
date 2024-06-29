"use client";
import React from "react";
import Header from "@/components/shared/Header";
import { store } from "@/store";
import { checkTokenExpiration } from "@/store/authSlice";
import { Provider } from "react-redux";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    store.dispatch(checkTokenExpiration());
  }, []);
  return (
    <>
      <Provider store={store}>
        <Header />
        <main className="max-w-[1224px] px-4 md:px-0 mx-auto ">{children}</main>
      </Provider>
    </>
  );
}
