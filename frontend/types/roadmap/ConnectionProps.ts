export interface ConnectionProps {
    connection: {
        from: string;
        to: string;
        style: "straight" | "curved";
    };
    circlesVisible: boolean;
    rectangles: {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    }[];
    onDelete: () => void;
    onChangeStyle: (style: "straight" | "curved") => void;
}
