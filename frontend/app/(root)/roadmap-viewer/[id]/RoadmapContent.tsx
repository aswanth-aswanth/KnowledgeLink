'use client';
import DiagramSection from './DiagramSection';
import EditModeButtons from './EditModeButtons';
import ConfirmationDialog from './ConfirmationDialog';
import { useRoadmapContent } from '@/hooks/useRoadmapContent';
import RoadmapViewer from '@/components/roadmap/RoadmapViewer';

export default function RoadmapContent() {
  const {
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
  } = useRoadmapContent();

  if (!roadmapData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DiagramSection
        isDiagramLoading={isDiagramLoading}
        rectangles={rectangles}
        connections={connections}
        roadmapData={roadmapData}
      />

      <EditModeButtons
        pathname={pathname}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        contributions={contributions}
        handleSubmit={handleSubmit}
      />

      <div className="max-w-[990px] mx-auto">
        <RoadmapViewer
          transformedTopics={roadmapData}
          isEditMode={isEditMode}
          onContentChange={handleContentChange}
          roadmapId={roadmapData._id}
        />
      </div>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={confirmSubmit}
      />
    </>
  );
}
