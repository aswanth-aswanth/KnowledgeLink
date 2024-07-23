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
  onSelect: (e: React.MouseEvent) => void;
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
        strokeWidth="1"
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
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        {rect.name}
      </text>
      {isSelected && circlesVisible && (
        <>
          <circle
            cx={rect.x + rect.width}
            cy={rect.y + rect.height}
            r="5"
            fill="blue"
            onMouseDown={(e) => {
              e.stopPropagation();
              const onMouseMove = (e: MouseEvent) => {
                const newWidth = e.clientX - rect.x;
                const newHeight = e.clientY - rect.y;
                onUpdateSize(Math.max(newWidth, 50), Math.max(newHeight, 20));
              };
              const onMouseUp = () => {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
              };
              window.addEventListener("mousemove", onMouseMove);
              window.addEventListener("mouseup", onMouseUp);
            }}
          />
          <circle
            cx={rect.x + rect.width}
            cy={rect.y + rect.height / 2 - 18}
            r="5"
            fill="red"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        </>
      )}
    </g>
  );
};

export default Rectangle;
