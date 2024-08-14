export interface RoadmapViewerSectionProps {
    scale: number;
    handleZoom: (direction: 'in' | 'out') => void;
    roadmapData: any;
    isEditMode: boolean;
    handleContentChange: (uniqueId: string, content: string) => void;
}