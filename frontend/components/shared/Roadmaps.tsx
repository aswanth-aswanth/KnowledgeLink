import React, { useState } from "react";
import { Tab } from "@/types";
import Tabs from "@/components/shared/Tabs";
import RoadmapItems from "./RoadmapItems";

export default function Roadmaps() {
  const [activeTab, setActiveTab] = useState<string>(
    "Expert Collaboration Roadmap"
  );

  const tabs: Tab[] = [
    { name: "Expert Collaboration Roadmap", icon: "👨‍🏫" },
    { name: "Public Voting Roadmap", icon: "🗳️" },
    { name: "Moderated Submission Roadmap", icon: "📝" },
  ];

  const cards = [
    {
      title: "Card Title 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      likes: 20,
    },
    {
      title: "Card Title 2",
      description:
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      likes: 15,
    },
    {
      title: "Card Title 3",
      description:
        "Nulla facilisi. Duis tincidunt libero in nulla elementum, sit amet suscipit dolor fermentum.",
      likes: 10,
    },
    {
      title: "Card Title 4",
      description:
        "Suspendisse potenti. Nam ut erat a leo varius ultricies nec sit amet eros.",
      likes: 18,
    },
    {
      title: "Card Title 5",
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
      likes: 25,
    },
    {
      title: "Card Title 6",
      description:
        "Maecenas vehicula dolor sed nulla maximus, sit amet gravida nunc cursus.",
      likes: 12,
    },
  ];
  return (
    <>
      <div className="flex justify-around">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
          tabFor="typesofroadmap"
        />
      </div>
      <div className="grid grid-cols-1 mt-14 md:grid-cols-3 gap-4">
        {cards.map((card, index) => (
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
