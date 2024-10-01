'use client';
import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import RoadmapViewer from '@/components/roadmap/RoadmapViewer';
import apiClient from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import ViewDiagram from '@/components/shared/ViewDiagram';
import { Skeleton } from '@/components/ui/skeleton';

async function getRoadmapData(id: string) {
  try {
    const res = await apiClient.get(`/roadmap/${id}`);
    console.log('response : ', res);
    return res.data;
  } catch (error) {
    console.log('Error : ', error);
  }
}

async function submitContribution(roadmapId: string, contributionData: any) {
  try {
    console.log('contributionData : ', contributionData);
    const res = await apiClient.post(
      `/roadmap/${roadmapId}/contribute`,
      contributionData
    );
    console.log('Res submit Controller : ', res.data);
    return res.data;
  } catch (error) {
    console.log('Error submitting contribution: ', error);
    throw error;
  }
}

export default function RoadmapContent() {
  const params = useParams();
  const pathname = usePathname();
  const [roadmapData, setRoadmapData] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contributions, setContributions] = useState({});
  const [rectangles, setRectangles] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isDiagramLoading, setIsDiagramLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof params.roadmapId === 'string') {
      getRoadmapData(params.roadmapId)
        .then((data) => {
          setRoadmapData(data);
          return getDiagramData(data);
        })
        .catch(console.error);
    }
  }, [params.roadmapId]);

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

  const confirmSubmit = async () => {
    try {
      const contributionData = {
        contributedDocumentIds: Object.keys(contributions),
        contributorId: 'user_id_here',
        contributions: Object.entries(contributions).map(([id, content]) => ({
          id,
          content: { data: content },
        })),
      };

      if (typeof params.roadmapId === 'string') {
        await submitContribution(params.roadmapId, contributionData);
      }
      setIsDialogOpen(false);
      setContributions({});
      setIsEditMode(false);
      toast({
        title: 'Contribution submitted',
        description: 'Your contribution has been successfully submitted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit contribution. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getDiagramData = async (roadmapData: any) => {
    setIsDiagramLoading(true);
    try {
      if (roadmapData.uniqueId) {
        const res = await apiClient(`/roadmap/diagram/${roadmapData.uniqueId}`);
        setRectangles(res.data[0].rectangles);
        setConnections(res.data[1].connections);
        console.log('Response Rect: ', res.data[0].rectangles);
      }
    } catch (error) {
      console.log('Error : ', error);
    } finally {
      setIsDiagramLoading(false);
    }
  };

  if (!roadmapData) {
    return <div className='dark:text-white'>Loading...</div>;
  }

  return (
    <div>
      {isDiagramLoading ? (
        <Skeleton className="w-full h-screen bg-slate-300" />
      ) : rectangles.length > 0 ? (
        <ViewDiagram
          rectangles={rectangles}
          connections={connections}
          roadmapData={roadmapData}
        />
      ) : null}
      <div className="flex justify-center items-center ">
        {pathname.split('/')[1] !== 'roadmap-viewer' && (
          <div>
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              variant="outline"
              className="mr-2"
            >
              {isEditMode ? 'View Mode' : 'Edit Mode'}
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
          roadmapId={roadmapData._id}
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
