import React from 'react';
import ZoomButtons from './ZoomButtons';
import RoadmapViewer from '@/components/roadmap/RoadmapViewer';
import { RoadmapViewerSectionProps } from '@/types/roadmap';

export default function RoadmapViewerSection({
  scale,
  handleZoom,
  roadmapData,
  isEditMode,
  handleContentChange,
}: RoadmapViewerSectionProps) {
  return (
    <div className="max-w-[990px] mx-auto relative">
      <ZoomButtons handleZoom={handleZoom} />
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
  );
}
