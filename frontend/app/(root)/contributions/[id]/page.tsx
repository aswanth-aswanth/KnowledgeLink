"use client";
import RoadmapViewerWithContributions from "@/app/(root)/contributions/[id]/RoadmapViewerWithContributions";
import { useParams } from "next/navigation";

export default function RoadmapPage() {
  const params = useParams();

  if (!params.id) {
    return <div>Loading...</div>;
  }

  return (
      <div className="max-w-[900px] min-h-[91.9vh] mx-auto">
        <RoadmapViewerWithContributions />
      </div>
  );
}
