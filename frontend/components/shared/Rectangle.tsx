"use client"
import React, { useState, useCallback } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

interface RectProps {
  rect: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    progress: number;
  };
  circlesVisible: boolean;
  isDarkMode: boolean;
  isSelected: boolean;
  onSelect: (event: React.MouseEvent) => void;
  onUpdatePosition: (newX: number, newY: number) => void;
  onUpdateSize: (newWidth: number, newHeight: number) => void;
  onDelete: () => void;
  onUpdateProgress: (progress: number) => void;
}

const Rectangle: React.FC<RectProps> = ({
  rect,
  isSelected,
  onSelect,
  onUpdatePosition,
  onUpdateSize,
  onDelete,
  circlesVisible,
  isDarkMode,
  onUpdateProgress,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
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

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      e.stopPropagation();
      onSelect(e);
    },
    [onSelect]
  );

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    onUpdateProgress(newProgress);
  };

  const gradientId = `rect-gradient-${rect.id}`;

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isDarkMode ? "#4a5568" : "#ebf8ff"} />
          <stop offset="100%" stopColor={isDarkMode ? "#2d3748" : "#bee3f8"} />
        </linearGradient>
      </defs>
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill={`url(#${gradientId})`}
        stroke={isSelected ? (isDarkMode ? "#90cdf4" : "#3182ce") : (isDarkMode ? "#718096" : "#a0aec0")}
        strokeWidth={2}
        rx={5}
        ry={5}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        style={{ cursor: "move" }}
      />
      <text
        x={rect.x + rect.width / 2}
        y={rect.y + rect.height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fill={isDarkMode ? "white" : "black"}
        className="select-none"
      >
        {isEditing ? (
          <foreignObject x={rect.x} y={rect.y} width={rect.width} height={rect.height}>
            <input
              type="text"
              value={rect.name}
              onChange={(e) => onUpdatePosition(rect.x, rect.y, e.target.value)}
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="w-full h-full text-center bg-transparent outline-none"
            />
          </foreignObject>
        ) : (
          rect.name
        )}
      </text>
      {isSelected && (
        <g>
          <circle
            cx={rect.x + rect.width}
            cy={rect.y + rect.height}
            r={5}
            fill="red"
            cursor="se-resize"
            onMouseDown={handleResizeStart}
          />
          <circle
            cx={rect.x + rect.width - 20}
            cy={rect.y}
            r={8}
            fill="blue"
            cursor="pointer"
            onClick={() => setIsEditing(true)}
          >
            <title>Edit</title>
          </circle>
          <FaEdit
            x={rect.x + rect.width - 24}
            y={rect.y - 4}
            fontSize="12"
            fill="white"
            style={{ pointerEvents: "none" }}
          />
          <circle
            cx={rect.x + rect.width}
            cy={rect.y}
            r={8}
            fill="red"
            cursor="pointer"
            onClick={onDelete}
          >
            <title>Delete</title>
          </circle>
          <FaTrash
            x={rect.x + rect.width - 4}
            y={rect.y - 4}
            fontSize="12"
            fill="white"
            style={{ pointerEvents: "none" }}
          />
        </g>
      )}
      <rect
        x={rect.x}
        y={rect.y + rect.height - 10}
        width={rect.width * (rect.progress / 100)}
        height={10}
        fill={isDarkMode ? "#48bb78" : "#38a169"}
        rx={5}
        ry={5}
      />
      {isSelected && (
        <foreignObject x={rect.x} y={rect.y + rect.height + 5} width={rect.width} height={20}>
          <input
            type="range"
            min="0"
            max="100"
            value={rect.progress}
            onChange={handleProgressChange}
            className="w-full"
          />
        </foreignObject>
      )}
    </g>
  );
};

export default Rectangle;