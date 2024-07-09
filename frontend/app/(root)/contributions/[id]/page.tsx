"use client";
import RoadmapViewerWithContributions from "@/app/(root)/contributions/[id]/RoadmapViewerWithContributions";
import { useParams } from "next/navigation";

export default function RoadmapPage() {
  const params = useParams();

  if (!params.id) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 pt-10"></div>
      <div className="max-w-[900px] mx-auto">
        <RoadmapViewerWithContributions />
      </div>
    </div>
  );
}
