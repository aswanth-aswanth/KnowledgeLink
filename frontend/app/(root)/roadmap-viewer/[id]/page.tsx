"use client";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import RoadmapViewer from "@/components/shared/RoadmapViewer";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import ViewDiagram from "@/components/shared/ViewDiagram";
import RoadmapIndex from "@/components/shared/RoadmapIndex";

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
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contributions, setContributions] = useState({});
  const [rectangles, setRectangles] = useState([]);
  const [connections, setConnections] = useState([]);
  const { toast } = useToast();
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);

  useEffect(() => {
    if (params.id) {
      getRoadmapData(params.id as string)
        .then((data) => {
          setRoadmapData(data);
          getDiagramData(data);
        })
        .catch(console.error);
    }
  }, [params.id]);

  const expandTopic = (uniqueId: string): string[] => {
    const topicPath = findTopicAndParents(roadmapData.topics, uniqueId);
    if (topicPath) {
      const newExpanded = new Set([...expandedTopics, ...topicPath]);
      setExpandedTopics(Array.from(newExpanded));
      return Array.from(newExpanded);
    }
    return expandedTopics;
  };

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
      toast({
        title: "Contribution submitted",
        description: "Your contribution has been successfully submitted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit contribution. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDiagramData = async (roadmapData: any) => {
    try {
      if (roadmapData.uniqueId) {
        const res = await apiClient(`/roadmap/diagram/${roadmapData.uniqueId}`);
        setRectangles(res.data[0].rectangles);
        setConnections(res.data[1].connections);
        console.log("Response Rect: ", res.data[0].rectangles);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  if (!roadmapData) {
    return <div>Loading...</div>;
  }

  const findTopicContent = (topics: any, uniqueId: string): string | null => {
    if (topics.uniqueId === uniqueId) {
      return topics.content;
    }
    if (topics.children) {
      for (const child of topics.children) {
        const content = findTopicContent(child, uniqueId);
        if (content) return content;
      }
    }
    return null;
  };

  function findTopicAndParents(
    topics: any,
    targetId: string,
    parents: string[] = []
  ): string[] | null {
    if (topics.uniqueId === targetId) {
      return [...parents, topics.uniqueId];
    }
    if (topics.children) {
      for (const child of topics.children) {
        const result = findTopicAndParents(child, targetId, [
          ...parents,
          topics.uniqueId,
        ]);
        if (result) return result;
      }
    }
    return null;
  }

  console.log("roadmapData unique : ", roadmapData);
  return (
    <div>
      {/* {roadmapData && (
        <div className="w-1/4 p-4">
          <RoadmapIndex roadmapData={roadmapData} />
        </div>
      )} */}
      {/* {rectangles.length > 0 && (
        <ViewDiagram rectangles={rectangles} connections={connections} />
      )} */}
      {rectangles.length > 0 && (
        <ViewDiagram
          rectangles={rectangles}
          connections={connections}
          onRectangleClick={(uniqueId) => {
            setSelectedTopic(uniqueId);
            const newExpandedTopics = expandTopic(uniqueId);

            // Force a re-render to ensure all topics are expanded
            setExpandedTopics([...newExpandedTopics]);

            // Use requestAnimationFrame to scroll after the DOM has updated
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const element = document.getElementById(`topic-${uniqueId}`);
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              });
            });
          }}
        />
      )}
      {selectedTopic && (
        <div className="mt-4 p-4 max-w-[72%] mx-auto border rounded">
          <h2 className="text-xl font-bold mb-2">
            {rectangles.find((r) => r.uniqueId === selectedTopic)?.name}
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: findTopicContent(roadmapData.topics, selectedTopic) || "",
            }}
          />
        </div>
      )}
      <div className="flex justify-between items-center ">
        <div></div>
        <h1 className="text-2xl font-bold text-gray-600">
          {/* Roadmap: {roadmapData.title} */}
        </h1>
        {pathname.split("/")[1] !== "roadmap-viewer" && (
          <div>
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              variant="outline"
              className="mr-2"
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
          selectedTopic={selectedTopic}
          expandTopic={expandTopic}
          expandedTopics={expandedTopics}
          setExpandedTopics={setExpandedTopics}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
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
