import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchDiagramData,
  fetchRoadmapData,
  submitRoadmapContribution,
} from "@/api/roadmapViewer";

export function useRoadmapContent() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const [roadmapData, setRoadmapData] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [contributions, setContributions] = useState<Record<string, string>>({});
  const [rectangles, setRectangles] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [isDiagramLoading, setIsDiagramLoading] = useState<boolean>(true);
  const [scale, setScale] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (params.id) {
        try {
          const result = await fetchRoadmapData(params.id);
          setRoadmapData(result);
          return getDiagramData(result);
        } catch (error) {
          console.log("Error : ", error);
        }
      }
    };
    fetchData();
  }, [params.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContentChange = (uniqueId: string, newContent: string) => {
    setContributions((prev) => ({
      ...prev,
      [uniqueId]: newContent,
    }));
  };

  const handleSubmit = async () => {
    setIsDialogOpen(true);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setScale((prevScale) => {
      const step = 0.07;
      const newScale = direction === 'in' ? prevScale + step : prevScale - step;
      return Math.max(0.5, Math.min(newScale, 2));
    });
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

      await submitRoadmapContribution(params.id as string, contributionData);
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
    setIsDiagramLoading(true);
    try {
      if (roadmapData.uniqueId) {
        const result = await fetchDiagramData(roadmapData);
        setRectangles(result[0].rectangles);
        setConnections(result[1].connections);
      }
    } catch (error) {
      console.log("Error : ", error);
    } finally {
      setIsDiagramLoading(false);
    }
  };

  return {
    roadmapData,
    isEditMode,
    setIsEditMode,
    isDialogOpen,
    setIsDialogOpen,
    contributions,
    rectangles,
    connections,
    isDiagramLoading,
    pathname,
    handleContentChange,
    handleSubmit,
    confirmSubmit,
    scale,
    setScale,
    handleZoom
  };
}
