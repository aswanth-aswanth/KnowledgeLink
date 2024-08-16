'use client';
import DiagramSection from './DiagramSection';
import EditModeButtons from './EditModeButtons';
import ConfirmationDialog from './ConfirmationDialog';
import { useRoadmapContent } from '@/hooks/useRoadmapContent';
import RoadmapViewerSection from './RoadmapViewerSection';

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
    scale,
    handleZoom,
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
      <RoadmapViewerSection
        scale={scale}
        handleZoom={handleZoom}
        roadmapData={roadmapData}
        isEditMode={isEditMode}
        handleContentChange={handleContentChange}
      />
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={confirmSubmit}
      />
    </>
  );
}
