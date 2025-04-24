'use client';

import React, { useEffect, useState } from 'react';
import { Tab } from '@/types';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchRoadmapsByType } from '@/redux/home/home.slice';
import {
  selectRoadmapData,
  selectIsLoadingRoadmapData,
} from '@/redux/home/home.selectors';

import Tabs from '@/components/shared/Tabs';
import RoadmapItems from '@/app/(root)/favourites-roadmaps/RoadmapItems';
import { Skeleton } from '@/components/ui/skeleton';

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

const tabs: Tab[] = [
  {
    name: 'Expert Collaboration Roadmap',
    icon: '👨‍🏫',
    dbName: 'expert_collaboration',
  },
  {
    name: 'Public Voting Roadmap',
    icon: '🗳️',
    dbName: 'public_voting',
  },
  {
    name: 'Moderated Submission Roadmap',
    icon: '📝',
    dbName: 'moderator_submission',
  },
];

const SkeletonRoadmapCard = () => (
  <div className="border dark:border-gray-700 rounded-xl p-4 shadow-sm w-full md:w-[calc(33.333%-1rem)] min-h-[200px] mb-4">
    <Skeleton className="rounded-xl bg-slate-300 h-6 w-3/4 mb-2" />
    <Skeleton className="rounded-xl bg-slate-300 h-4 w-full mb-2" />
    <Skeleton className="rounded-xl bg-slate-300 h-4 w-5/6 mb-2" />
    <div className="flex justify-between items-center mt-4">
      <Skeleton className="rounded-xl bg-slate-300 h-4 w-16" />
      <Skeleton className="rounded-xl bg-slate-300 h-8 w-24" />
    </div>
  </div>
);

const Roadmaps = () => {
  const dispatch = useAppDispatch();
  const roadmapData = useAppSelector(selectRoadmapData);
  const isLoading = useAppSelector(selectIsLoadingRoadmapData);

  const [activeTab, setActiveTab] = useState(tabs[0].name);

  useEffect(() => {
    const selectedTab = tabs.find((t) => t.name === activeTab);
    if (selectedTab) {
      dispatch(
        fetchRoadmapsByType(selectedTab?.dbName || 'expert_collaboration')
      );
    }
  }, [activeTab, dispatch]);

  const handleTabClick = (name: string, dbName?: string) => {
    setActiveTab(name);
    dispatch(fetchRoadmapsByType(dbName || 'expert_collaboration'));
  };

  const renderRoadmaps = () => {
    if (isLoading) {
      return Array.from({ length: 6 }, (_, i) => (
        <SkeletonRoadmapCard key={i} />
      ));
    }

    return roadmapData.map((item) => (
      <div key={item._id} className=" w-full md:w-[calc(33.333%-1rem)] ">
        <RoadmapItems
          title={item.title}
          description={item.description}
          likes={item.likes}
          id={item._id}
        />
      </div>
    ));
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mt-6 mb-8 text-text3">
        Roadmap Explorer
      </h2>
      <div className="flex justify-center mb-8">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          tabFor={'Expert Collaboration Roadmap'}
          className="flex flex-col sm:flex-row gap-8"
        />
      </div>
      <div className="flex flex-wrap justify-center mt-14 gap-4">
        {renderRoadmaps()}
      </div>
    </>
  );
};

export default Roadmaps;
