import React, { useState, useCallback } from "react";

interface RectProps {
  rect: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  onUpdatePosition: (newX: number, newY: number) => void;
  onUpdateSize: (newWidth: number, newHeight: number) => void;
  onDelete: () => void;
}

const Rectangle: React.FC<RectProps> = ({
  rect,
  isSelected,
  onSelect,
  onUpdatePosition,
  onUpdateSize,
  onDelete,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      if (e.button === 0) {
        // Right mouse button
        e.preventDefault();
        onSelect();
      }
    },
    [onSelect]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent<SVGCircleElement>) => {
      e.stopPropagation();
      setIsResizing(true);
      setResizeStart({ x: e.clientX, y: e.clientY });
    },
    []
  );

  const handleResizeMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (isResizing) {
        const dx = e.clientX - resizeStart.x;
        const dy = e.clientY - resizeStart.y;
        const newWidth = Math.max(rect.width + dx, 50);
        const newHeight = Math.max(rect.height + dy, 30);
        onUpdateSize(newWidth, newHeight);
        setResizeStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isResizing, rect.width, rect.height, resizeStart, onUpdateSize]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  return (
    <g>
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill={isSelected ? "lightblue" : "white"}
        stroke={isSelected ? "blue" : "black"}
        strokeWidth={2}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        style={{ cursor: "move" }}
      />
      <text
        x={rect.x + rect.width / 2}
        y={rect.y + rect.height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
      >
        {rect.id}
      </text>
      {isSelected && (
        <>
          <circle
            cx={rect.x + rect.width}
            cy={rect.y + rect.height}
            r={5}
            fill="red"
            cursor="se-resize"
            onMouseDown={handleResizeStart}
          />
          <circle
            cx={rect.x + rect.width}
            cy={rect.y}
            r={5}
            fill="red"
            cursor="pointer"
            onClick={onDelete}
          />
        </>
      )}
    </g>
  );
};

export default Rectangle;
