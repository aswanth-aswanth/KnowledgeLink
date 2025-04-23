import ViewDiagram from '@/components/shared/ViewDiagram';
import { DiagramSectionProps } from '@/types/roadmap';

export default function DiagramSection({
  rectangles,
  connections,
  roadmapData,
}: DiagramSectionProps) {
  if (rectangles.length > 0) {
    return (
      <ViewDiagram
        rectangles={rectangles}
        connections={connections}
        roadmapData={roadmapData}
      />
    );
  }

  return null;
}
