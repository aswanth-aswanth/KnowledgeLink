export interface RectangleProps {
    rect: {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
        name: string;
    };
    isSelected: boolean;
    onSelect: () => void;
    onUpdatePosition: (x: number, y: number) => void;
    onUpdateSize: (width: number, height: number) => void;
    onDelete: () => void;
    circlesVisible: boolean;
}
