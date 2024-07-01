// components/shared/Card.tsx
import React from "react";
import { FiHeart } from "react-icons/fi";
import { useRouter } from "next/navigation";

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
  return (
    <div
      onClick={() => router.push(`/roadmap-viewer/${id}`)}
      className="p-4 bg-white w-full rounded-lg shadow-md border cursor-pointer"
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center text-gray-500">
        <FiHeart className="mr-1" />
        <span>{likes} Likes</span>
      </div>
    </div>
  );
};

export default RoadmapItems;
