"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarousalSize from "@/components/shared/CarousalSize";
import PopularContributors from "@/components/shared/PopularContributors";
import TrendingArticles from "@/components/shared/TrendingArticles";
import Tabs from "@/components/shared/Tabs";
import { Tab } from "@/types";
import Roadmaps from "@/components/shared/Roadmaps";
import { Provider } from "react-redux";
import { store } from "@/store";

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
    <Provider store={store}>
      <div className="-mt-2 pt-6 pb-8">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={(value) => {
            if (value === "Following") router.push("/following");
          }}
          tabFor="explore"
        />
        {/* <WelcomeComponent /> */}

        <CarousalSize />
        <PopularContributors />
        <TrendingArticles />
        <Roadmaps />
      </div>
    </Provider>
  );
};

export default TabNavigation;
