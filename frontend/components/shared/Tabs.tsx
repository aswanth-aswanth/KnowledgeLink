'use client';

import type React from 'react';
import { cn } from '@/lib/utils';

export interface Tab {
  name: string;
  icon?: string;
  dbName?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (name: string, dbName?: string) => void;
  isDarkMode?: boolean;
  tabFor?: 'explore' | 'other';
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabClick,
  isDarkMode = false,
  tabFor = 'other',
  className,
  tabClassName,
  activeTabClassName,
}) => {
  return (
    <div
      className={cn(
        'flex gap-8',
        tabFor === 'explore' &&
          'fixed bottom-0 w-full z-50 md:flex md:static md:max-w-lg gap-0 justify-around md:gap-8',
        isDarkMode ? 'bg-gray-800' : 'bg-white',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => onTabClick(tab.name, tab.dbName)}
          className={cn(
            'relative flex flex-col sm:flex-row items-center space-x-2 px-2 py-4 md:py-2 rounded-md transition-all duration-300 ease-in-out',
            activeTab === tab.name
              ? isDarkMode
                ? 'text-blue-400 bg-blue-900'
                : 'text-blue-600 bg-blue-50'
              : isDarkMode
              ? 'text-gray-50 hover:text-gray-100 hover:bg-gray-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            tabFor === 'explore' ? 'flex-1' : 'px-4 py-2',
            tabClassName,
            activeTab === tab.name && activeTabClassName
          )}
        >
          {tab.icon && (
            <span className="text-lg hidden md:inline">{tab.icon}</span>
          )}
          <span
            className={cn(
              'font-medium',
              isDarkMode ? 'text-white' : 'text-gray-800',
              'text-xs sm:text-sm md:text-lg'
            )}
          >
            {tab.name}
          </span>
          <span
            className={cn(
              'absolute bottom-0 left-0 w-full h-0.5',
              isDarkMode ? 'bg-blue-400' : 'bg-blue-600',
              'transform origin-left transition-all duration-300 ease-in-out',
              activeTab === tab.name ? 'scale-x-100' : 'scale-x-0'
            )}
            style={{ margin: 0 }}
          />
        </button>
      ))}
    </div>
  );
};

export default Tabs;
