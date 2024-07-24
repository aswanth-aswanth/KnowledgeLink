// components/shared/RoadmapItems.tsx
import React from "react";
import { FiHeart } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import apiClient from "@/api/apiClient";
import toast from "react-hot-toast";

export type CardProps = {
  title: string;
  description: string;
  likes: number;
  id: string;
};

const RoadmapItems: React.FC<CardProps> = ({
  title,
  description,
  likes,
  id,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const subscribe = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    try {
      console.log("Subscribed to roadmap:", id);
      const res = await apiClient.post("/profile/subscribe", { roadmapId: id });
      toast.success(res.data.message);
      console.log("Response:", res);
    } catch (error) {
      toast.error("Subscription failed");
      console.log("Error:", error);
    }
  };

  return (
    <div
      onClick={() => router.push(`/roadmap-viewer/${id}`)}
      className="p-4 bg-white w-full rounded-xl shadow-md border cursor-pointer"
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center justify-between text-gray-500">
        <div className="flex items-center">
          <FiHeart className="mr-1" />
          <span>{likes} Likes</span>
        </div>
        {pathname !== "/favourites-roadmaps" && (
          <button
            onClick={(e) => subscribe(e, id)}
            className="ml-4 px-4 py-2 border border-green-500 text-black font-semibold rounded-lg shadow-md hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            Subscribe
          </button>
        )}
      </div>
    </div>
  );
};

export default RoadmapItems;
