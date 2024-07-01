// Roadmaps.tsx
import React, { useState, useEffect } from "react";
import { Tab } from "@/types";
import Tabs from "@/components/shared/Tabs";
import RoadmapItems from "./RoadmapItems";
import apiClient from "@/api/apiClient";

export default function Roadmaps() {
  const [activeTab, setActiveTab] = useState<string>(
    "Expert Collaboration Roadmap"
  );
  const [roadmapData, setRoadmapData] = useState([]);

  const getRoadmapByType = async (roadmapType: string) => {
    try {
      const res = await apiClient.get(`/roadmap?type=${roadmapType}`);
      setRoadmapData(res.data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    const tab = tabs.find((t) => t.name === activeTab);
    if (tab) {
      getRoadmapByType(tab.dbName);
    }
  }, [activeTab]);

  const handleTabClick = (name: string, dbName: string) => {
    setActiveTab(name);
    getRoadmapByType(dbName);
  };

  const tabs: Tab[] = [
    {
      name: "Expert Collaboration Roadmap",
      icon: "👨‍🏫",
      dbName: "expert_collaboration",
    },
    { name: "Public Voting Roadmap", icon: "🗳️", dbName: "public_voting" },
    {
      name: "Moderated Submission Roadmap",
      icon: "📝",
      dbName: "moderator_submission",
    },
  ];

  return (
    <>
      <div className="flex justify-around">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          tabFor="typesofroadmap"
        />
      </div>
      <div className="grid grid-cols-1 mt-14 md:grid-cols-3 gap-4">
        {roadmapData.map((card, index) => (
          <div key={index}>
            <RoadmapItems
              title={card.title}
              description={card.description}
              likes={card.likes}
            />
          </div>
        ))}
      </div>
    </>
  );
}
