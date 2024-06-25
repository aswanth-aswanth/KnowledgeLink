// components/shared/Card.tsx
import React from "react";
import { FiHeart } from "react-icons/fi";

export type CardProps = {
  title: string;
  description: string;
  likes: number;
};

const RoadmapItems: React.FC<CardProps> = ({ title, description, likes }) => {
  return (
    <div className="p-4 bg-white w-full rounded-lg shadow-md border">
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
