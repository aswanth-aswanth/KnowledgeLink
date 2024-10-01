import { Skeleton } from '@/components/ui/skeleton';
import ViewDiagram from '@/components/shared/ViewDiagram';
import { DiagramSectionProps } from '@/types/roadmap';

export default function DiagramSection({
  isDiagramLoading,
  rectangles,
  connections,
  roadmapData,
}: DiagramSectionProps) {
  if (isDiagramLoading) {
    return <Skeleton className="w-full h-[90.9vh] bg-slate-300" />;
  }

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
