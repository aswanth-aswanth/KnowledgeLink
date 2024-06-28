export interface RectProps {
    rect: {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
        name: string;
    };
    circlesVisible: boolean;
    isSelected: boolean;
    onSelect: (event: React.MouseEvent) => void;
    onUpdatePosition: (newX: number, newY: number) => void;
    onUpdateSize: (newWidth: number, newHeight: number) => void;
    onDelete: () => void;
}