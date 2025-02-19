'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layouts/Sidebar';
import { TopBar } from '@/components/layouts/TopBar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminAuthWrapper from '../AdminAuthWrapper';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <AdminAuthWrapper>
      <div className="flex h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <div
          className={cn(
            'fixed inset-y-0 left-0 transform',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'md:relative md:translate-x-0 transition duration-200 ease-in-out z-30',
            'bg-gray-100 dark:bg-gray-800'
          )}
        >
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </TopBar>
          <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
      </div>
    </AdminAuthWrapper>
  );
}
