'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VideoShorts from '@/components/shared/VideoShorts';
import PopularContributors from '@/components/shared/PopularContributors';
import TrendingArticles from '@/components/shared/TrendingArticles';
import Tabs from '@/components/shared/Tabs';
import Roadmaps from '@/components/roadmap/Roadmaps';

const TabNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Explore');
  const router = useRouter();

  const tabs = [
    { name: 'Explore', icon: '🌎' },
    { name: 'Following', icon: '👥' },
  ];

  const handleTabClick = (name: string) => {
    setActiveTab(name);
    if (name === 'Following') router.push('/following');
  };

  return (
    <div className="-mt-2 pt-6 pb-20 md:pb-8">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        tabFor="Explore"
      />
      <PopularContributors />
      <VideoShorts />
      <TrendingArticles />
      <Roadmaps />
    </div>
  );
};

export default TabNavigation;
