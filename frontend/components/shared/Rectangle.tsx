// components/Rectangle.tsx
import React from "react";
import { useDarkMode } from "@/hooks/useDarkMode";

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
  const { isDarkMode } = useDarkMode();
  const bgColorDark = "#111827"; // bg-gray-900
  const bgColorLight = "#ffffff"; // white

  return (
    <g>
      <defs>
        <filter id="blur">
          <feGaussianBlur stdDeviation="30" />
        </filter>
      </defs>

      {/* Solid background rectangle */}
      <rect
        x={rect.x} // Slightly larger than the glass rectangle
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill={isDarkMode ? bgColorDark : bgColorLight}
        rx="12"
        ry="12"
        opacity={0.8}
      />

      {/* Glass effect rectangle */}
      <rect
        x={rect.x}
        y={rect.y}
        rx="12"
        ry="12"
        width={rect.width}
        height={rect.height}
        fill={isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
        stroke={isSelected ? (isDarkMode ? "#03dac6" : "#018786") : "none"}
        strokeWidth="2"
        filter="url(#blur)"
        onClick={onSelect}
        style={{ cursor: "pointer" }}
      />

      {/* Text */}
      <text
        x={rect.x + rect.width / 2}
        y={rect.y + rect.height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fontWeight="semibold"
        fill={isDarkMode ? "#ffffff" : "#000000"}
        onClick={onSelect}
        style={{ cursor: "pointer" }}
      >
        {rect.name}
      </text>
    </g>
  );
};

export default Rectangle;
