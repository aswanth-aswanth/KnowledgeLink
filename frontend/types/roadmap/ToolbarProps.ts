export interface ToolbarProps {
    onSelectLineStyle: (style: "straight" | "curved") => void;
    selectedLineStyle: "straight" | "curved";
    isMultiSelectMode: boolean;
    onToggleMultiSelect: () => void;
    circlesVisible: boolean;
    onToggleCircleVisibility: () => void;
    onCopySVG: () => void;
    onScaleUp: () => void;
    onScaleDown: () => void;
    onToggleConnecting: () => void;
    isConnectingMode: boolean;
}