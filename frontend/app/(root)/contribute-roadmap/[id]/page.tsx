"use client";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import RoadmapViewer from "@/components/shared/RoadmapViewer";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/useDarkMode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

async function getRoadmapData(id: string) {
  try {
    const res = await apiClient.get(`/roadmap/${id}`);
    console.log("response : ", res);
    return res.data;
  } catch (error) {
    console.log("Error : ", error);
  }
}

async function submitContribution(roadmapId: string, contributionData: any) {
  try {
    console.log("contributionData : ", contributionData);
    const res = await apiClient.post(
      `/roadmap/${roadmapId}/contribute`,
      contributionData
    );
    console.log("Res submit Controller : ", res.data);

    return res.data;
  } catch (error) {
    console.log("Error submitting contribution: ", error);
    throw error;
  }
}

export default function RoadmapPage() {
  const params = useParams();
  const pathname = usePathname();
  const [roadmapData, setRoadmapData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contributions, setContributions] = useState({});
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (params.id) {
      getRoadmapData(params.id as string)
        .then((data) => setRoadmapData(data))
        .catch(console.error);
    }
  }, [params.id]);

  const handleContentChange = (uniqueId: string, newContent: string) => {
    setContributions((prev) => ({
      ...prev,
      [uniqueId]: newContent,
    }));
  };

  const handleSubmit = async () => {
    setIsDialogOpen(true);
  };

  const confirmSubmit = async () => {
    try {
      const contributionData = {
        contributedDocumentIds: Object.keys(contributions),
        contributorId: "user_id_here",
        contributions: Object.entries(contributions).map(([id, content]) => ({
          id,
          content: { data: content },
        })),
      };

      await submitContribution(params.id, contributionData);
      setIsDialogOpen(false);
      setContributions({});
      setIsEditMode(false);
      toast("Your contribution has been successfully submitted.", {
        icon: "👏",
      });
    } catch (error) {
      toast.error("Failed to submit contribution. Please try again.");
    }
  };

  if (!roadmapData) {
    return <div>Loading...</div>;
  }
  console.log("Pathname : ", pathname.split("/")[1]);
  console.log("contributions : ", contributions);
  return (
    <div>
      <div className="flex justify-between items-center mb-4 pt-10">
        <h1 className="text-2xl font-bold text-gray-600">
          {/* Roadmap: {roadmapData.title} */}
        </h1>
        {pathname.split("/")[1] !== "roadmap-viewer" && (
          <div>
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              variant="outline"
              className={`mr-2 md:mr-16 lg:mr-32 ${
                isDarkMode && "text-white "
              }`}
            >
              {isEditMode ? "View Mode" : "Edit Mode"}
            </Button>
            {isEditMode && Object.keys(contributions).length > 0 && (
              <Button onClick={handleSubmit}>Submit Contribution</Button>
            )}
          </div>
        )}
      </div>
      <div className="max-w-[900px] mx-auto">
        <RoadmapViewer
          transformedTopics={roadmapData}
          isEditMode={isEditMode}
          onContentChange={handleContentChange}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your contribution to this roadmap?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSubmit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
