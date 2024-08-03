// components/Rectangle.tsx
import React from "react";

interface RectangleProps {
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

const Rectangle: React.FC<RectangleProps> = ({
  rect,
  isSelected,
  onSelect,
  onUpdatePosition,
  onUpdateSize,
  onDelete,
  circlesVisible,
}) => {
  return (
    <g>
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill="white"
        stroke={isSelected ? "blue" : "black"}
        strokeWidth="0.4"
        rx="2"
        ry="2"
        onClick={onSelect}
        style={{ cursor: "pointer" }}
      />
      <text
        x={rect.x + rect.width / 2}
        y={rect.y + rect.height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        onClick={onSelect}
        style={{ cursor: "pointer" }}
      >
        {rect.name}
      </text>
    </g>
  );
};

export default Rectangle;
