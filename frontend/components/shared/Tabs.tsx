"use client";
import React from "react";
import { TabsProps } from "@/types";

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick, tabFor }) => {
  return (
    <div
      className={`
      flex gap-8
      ${
        tabFor === "explore"
          ? "fixed bottom-0 bg-white w-full z-50 md:flex md:static md:max-w-lg gap-2 justify-around  md:gap-8"
          : "flex flex-col sm:flex-row gap-8"
      }`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => onTabClick(tab.name)}
          className={`relative flex flex-col sm:flex-row items-center space-x-2 px-2 py-2 rounded-md transition-all duration-300 ease-in-out${
            activeTab === tab.name
              ? "text-blue-600 bg-blue-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          } ${tabFor === "explore" ? "flex-1" : "px-4 py-2"}`}
        >
          <span className="text-lg">{tab.icon}</span>
          <span className="font-medium text-xs sm:text-sm md:text-lg">
            {tab.name}
          </span>
          <span
            className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-all duration-300 ease-in-out ${
              activeTab === tab.name ? "scale-x-100" : "scale-x-0"
            }`}
            style={{ margin: 0 }}
          />
        </button>
      ))}
    </div>
  );
};

export default Tabs;
