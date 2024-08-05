export interface ChooseRoadmapTypeProps {
    onContinue: (roadmapType: string, members: any[]) => void;
    roadmapType: string;
    setRoadmapType: (type: string) => void;
}