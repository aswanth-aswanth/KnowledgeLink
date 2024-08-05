export interface ViewDiagramProps {
    rectangles: {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
        name: string;
        uniqueId: string;
    }[];
    connections: {
        from: string;
        to: string;
        style: "straight" | "curved";
    }[];
    roadmapData: any;
}
