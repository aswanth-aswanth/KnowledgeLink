'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export interface DropdownItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  // Flag to insert a separator before this item if needed.
  separator?: boolean;
}

export interface ConfigurableDropdownProps {
  // Array of items to render inside the dropdown
  items: DropdownItem[];
  // The element to be used as the dropdown trigger
  trigger: React.ReactNode;
  // Optional custom class names for the content container
  contentClassName?: string;
  // Alignment of the dropdown menu: 'start', 'center', or 'end'
  align?: 'start' | 'center' | 'end';
}

const ConfigurableDropdown: React.FC<ConfigurableDropdownProps> = ({
  items,
  trigger,
  contentClassName = 'w-56 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white',
  align = 'end',
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className={contentClassName}
        align={align}
        forceMount
      >
        {items.map((item) => (
          <React.Fragment key={item.key}>
            {item.separator && (
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
            )}
            <DropdownMenuItem
              onClick={item.onClick}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConfigurableDropdown;
