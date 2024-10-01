import React, { useState, useEffect } from 'react';
import { Tab } from '@/types';
import Tabs from '@/components/shared/Tabs';
import RoadmapItems from '../../app/(root)/favourites-roadmaps/RoadmapItems';
import apiClient from '@/api/apiClient';
import { Skeleton } from '@/components/ui/skeleton';

export default function Roadmaps() {
  const [activeTab, setActiveTab] = useState<string>(
    'Expert Collaboration Roadmap'
  );
  const [roadmapData, setRoadmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRoadmapByType = async (roadmapType: string) => {
    setLoading(true);
    try {
      const res = await apiClient(`/roadmap/type?type=${roadmapType}`);
      setRoadmapData(res.data);
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tab = tabs.find((t: Tab) => t.name === activeTab);
    if (tab) {
      getRoadmapByType(tab.dbName || 'expert_collaboration');
    }
  }, [activeTab]);

  const handleTabClick = (name: string, dbName: string) => {
    setActiveTab(name);
    getRoadmapByType(dbName);
  };

  const tabs: Tab[] = [
    {
      name: 'Expert Collaboration Roadmap',
      icon: '👨‍🏫',
      dbName: 'expert_collaboration',
    },
    { name: 'Public Voting Roadmap', icon: '🗳️', dbName: 'public_voting' },
    {
      name: 'Moderated Submission Roadmap',
      icon: '📝',
      dbName: 'moderator_submission',
    },
  ];

  const SkeletonRoadmapItem = () => (
    <div className="border rounded-xl p-4 shadow-sm w-full md:w-[calc(33.333%-1rem)] mb-4">
      <Skeleton className="rounded-xl bg-slate-300 h-6 w-3/4 mb-2" />
      <Skeleton className="rounded-xl bg-slate-300 h-4 w-full mb-2" />
      <Skeleton className="rounded-xl bg-slate-300 h-4 w-5/6 mb-2" />
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="rounded-xl bg-slate-300 h-4 w-16" />
        <Skeleton className="rounded-xl bg-slate-300 h-8 w-24" />
      </div>
    </div>
  );

  return (
    <>
      <p className="dark:text-white font-bold text-center text-4xl mt-6 mb-8">
        Roadmaps
      </p>
      <div className="flex justify-around">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          tabFor="typesofroadmap"
        />
      </div>
      <div className="flex flex-wrap justify-center mt-14 gap-4">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => <SkeletonRoadmapItem key={index} />)
          : roadmapData.map((card: any, index) => (
              <div key={index} className="w-full md:w-[calc(33.333%-1rem)]">
                <RoadmapItems
                  title={card.title}
                  description={card.description}
                  likes={card.likes}
                  id={card._id}
                />
              </div>
            ))}
      </div>
    </>
  );
}
