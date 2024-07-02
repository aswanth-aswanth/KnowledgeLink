// layout.tsx
"use client";
import React from "react";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <Header /> */}
      <main className="">
        {children}
      </main>
    </>
  );
};

export default RootLayout;
