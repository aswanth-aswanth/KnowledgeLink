'use client';
import { useState } from 'react';
import DiagramSection from './DiagramSection';
import EditModeButtons from './EditModeButtons';
import ConfirmationDialog from './ConfirmationDialog';
import { useRoadmapContent } from '@/hooks/useRoadmapContent';
import RoadmapViewer from '@/components/roadmap/RoadmapViewer';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi'; // Import icons

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

  const [scale, setScale] = useState(1);

  if (!roadmapData) {
    return <div>Loading...</div>;
  }

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.07, 2));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.07, 0.5));
  };

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
      <div className="max-w-[990px] mx-auto relative">
        <div className="absolute top-0 right-0 flex z-50 space-x-2 p-2">
          <button
            onClick={handleZoomIn}
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
            aria-label="Zoom in"
          >
            <FiZoomIn />
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
            aria-label="Zoom out"
          >
            <FiZoomOut />
          </button>
        </div>
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top',
            transition: 'transform 0.3s ease',
          }}
        >
          <RoadmapViewer
            transformedTopics={roadmapData}
            isEditMode={isEditMode}
            onContentChange={handleContentChange}
            roadmapId={roadmapData._id}
          />
        </div>
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={confirmSubmit}
      />
    </>
  );
}
