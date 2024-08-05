"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarousalSize from "@/components/shared/CarousalSize";
import PopularContributors from "@/components/shared/PopularContributors";
import TrendingArticles from "@/components/shared/TrendingArticles";
import Tabs from "@/components/shared/Tabs";
import { Tab } from "@/types";
import Roadmaps from "@/components/roadmap/Roadmaps";

const TabNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Explore");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      router.push("/");
    }
  }, [token]);

  const tabs: Tab[] = [
    { name: "Explore", icon: "🌎" },
    { name: "Following", icon: "👥" },
  ];

  return (
    <div className="-mt-2 pt-6 pb-20 md:pb-8">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={(value) => {
          if (value === "Following") router.push("/following");
        }}
        tabFor="explore"
      />
      <CarousalSize />
      <PopularContributors />
      <TrendingArticles />
      <Roadmaps />
    </div>
  );
};

export default TabNavigation;
