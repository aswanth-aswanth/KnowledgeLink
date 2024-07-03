"use client";
import RoadmapViewerWithContributions from "@/components/shared/RoadmapViewerWithContributions";
import { useParams } from "next/navigation";

export default function RoadmapPage() {
  const params = useParams();

  if (!params.id) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 pt-10">
        <h1 className="text-2xl font-bold text-gray-500">Roadmap</h1>
      </div>
      <div className="max-w-[900px] mx-auto">
        <RoadmapViewerWithContributions />
      </div>
    </div>
  );
}
