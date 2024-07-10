"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tabs from "@/components/shared/Tabs";
import { Tab } from "@/types";
import { Provider } from "react-redux";
import { store } from "@/store";
import { CreatePostButton } from "./CreatePostButton";
import { CreatePostModal } from "./CreatePostModal";
import { PostFeed } from "./PostFeed";

const Following: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Following");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            if (value === "Explore") router.push("/");
          }}
          tabFor="explore"
        />
      </div>
      <div className="flex flex-col mb-6 items-center font-semibold gap-4 text-gray-700 mt-4">
        <CreatePostButton onClick={() => setIsModalOpen(true)} />
        <p>Create a post</p>
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
      <PostFeed />
    </Provider>
  );
};

export default Following;
