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
          onTabClick={setActiveTab}
          tabFor="explore"
        />
        {/* <WelcomeComponent /> */}
        <p className="text-gray-500 font-medium text-lg mt-6 mb-8">
          Recommended for you
        </p>
        <div className="flex justify-center mx-auto w-[86%]">
          <CarousalSize />
        </div>
        <p className="text-gray-500 font-medium text-lg mt-6 mb-8">
          Popular writers
        </p>
        <PopularContributors />
        <p className="text-gray-500 font-medium text-lg mt-6 mb-8">
          Trending articles
        </p>
        <TrendingArticles />
        <p className="text-gray-500 font-bold text-center text-4xl mt-6 mb-8">
          Roadmaps
        </p>
        <Roadmaps />
      </div>
    </Provider>
  );
};

export default TabNavigation;
