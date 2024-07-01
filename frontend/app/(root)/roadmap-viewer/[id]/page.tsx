"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RoadmapViewer from "@/components/shared/RoadmapViewer";
import NestedNoteTaker from "@/components/shared/NestedNoteTaker";
import apiClient from "@/api/apiClient";

async function getRoadmapData(id: string) {
  try {
    const res = await apiClient.get(`/roadmap/${id}`);
    console.log("response : ", res);
    return res.data;
  } catch (error) {
    console.log("Error : ", error);
  }
}

export default function RoadmapPage() {
  const params = useParams();
  const [roadmapData, setRoadmapData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (params.id) {
      getRoadmapData(params.id as string)
        .then((data) => setRoadmapData(data))
        .catch(console.error);
    }
  }, [params.id]);

  if (!roadmapData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center  mb-4 pt-10">
        <h1 className="text-2xl font-bold text-gray-600">Roadmap: </h1>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isEditMode ? "View Mode" : "Edit Mode"}
        </button>
      </div>
      {isEditMode ? (
        <RoadmapViewer transformedTopics={roadmapData} />
      ) : (
        <div className="max-w-[1000px] mx-auto">
          {/* // <NestedNoteTaker initialData={roadmapData} /> */}
          <RoadmapViewer transformedTopics={roadmapData} />
        </div>
      )}
    </div>
  );
}
