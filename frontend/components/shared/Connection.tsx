// Connection.tsx
import React from "react";
import { ConnectionType, Rect } from "@/types/types";

interface ConnectionProps {
  connection: ConnectionType;
  rectangles: Rect[];
  onDelete: () => void;
  onChangeStyle: (style: "straight" | "curved") => void;
  circlesVisible: boolean;
  isDarkMode: boolean;
}

const Connection: React.FC<ConnectionProps> = ({
  connection,
  rectangles,
  onDelete,
  onChangeStyle,
  circlesVisible,
  isDarkMode,
}) => {
  const fromRect = rectangles.find((r) => r.id === connection.from);
  const toRect = rectangles.find((r) => r.id === connection.to);

  if (!fromRect || !toRect) return null;

  const startX = fromRect.x + fromRect.width / 2;
  const startY = fromRect.y + fromRect.height / 2;
  const endX = toRect.x + toRect.width / 2;
  const endY = toRect.y + toRect.height / 2;

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  let pathD: string;
  let strokeDasharray: string;

  if (connection.style === "straight") {
    pathD = `M${startX},${startY} L${endX},${endY}`;
    strokeDasharray = "4 4";
  } else {
    const curveX1 = startX + (midX - startX) / 2;
    const curveY1 = startY;
    const curveX2 = endX - (endX - midX) / 2;
    const curveY2 = endY;
    pathD = `M${startX},${startY} C${curveX1},${curveY1} ${curveX2},${curveY2} ${endX},${endY}`;
    strokeDasharray = "none";
  }

  return (
    <g>
      <path
        d={pathD}
        fill="none"
        stroke={isDarkMode ? "rgb(156,163,175)" : "rgb(107,114,128)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray}
      />
      {circlesVisible && (
        <>
          <circle
            cx={midX}
            cy={midY}
            r="6"
            fill="red"
            stroke="white"
            strokeWidth="2"
            style={{ cursor: "pointer" }}
            onClick={onDelete}
          >
            <title>Delete Connection</title>
          </circle>
          <circle
            cx={midX + 15}
            cy={midY}
            r="6"
            fill="blue"
            stroke="white"
            strokeWidth="2"
            style={{ cursor: "pointer" }}
            onClick={() =>
              onChangeStyle(
                connection.style === "straight" ? "curved" : "straight"
              )
            }
          >
            <title>Change Style</title>
          </circle>
        </>
      )}
    </g>
  );
};

export default Connection;
