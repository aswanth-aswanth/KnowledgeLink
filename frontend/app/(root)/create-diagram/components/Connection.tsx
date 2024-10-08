import React from "react";
import { ConnectionProps } from "@/types/roadmap";

const Connection: React.FC<ConnectionProps> = ({
  connection,
  rectangles,
  onDelete,
  onChangeStyle,
  circlesVisible,
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
  let stroke: string;
  let strokeWidth: string;

  if (connection.style === "straight") {
    const curveX1 = startX + (midX - startX) / 2;
    const curveY1 = startY - 88;
    const curveX2 = endX - (endX - midX) / 2;
    const curveY2 = endY + 90;
    pathD = `M${startX},${startY} C${curveX1},${curveY1} ${curveX2},${curveY2} ${endX},${endY}`;
    strokeDasharray = "0 0";
    stroke = "url(#straightLineGradient)";
    strokeWidth = "7";
  } else {
    const controlPointFactorX = 0.2;
    const controlPointFactorY = 0.6;

    pathD = `M${startX},${startY} C${
      startX + (endX - startX) * controlPointFactorX
    },${startY + (endY - startY) * controlPointFactorY} ${
      endX - (endX - startX) * controlPointFactorX
    },${endY - (endY - startY) * controlPointFactorY} ${endX},${endY}`;
    strokeDasharray = "10 8";
    stroke = "url(#lineGradient)";
    strokeWidth = "3";
  }

  return (
    <g>
      <defs>
        <linearGradient id="straightLineGradient">
          <stop stopColor="hsl(180, 78%, 61%)" offset="0"></stop>
          <stop stopColor="hsl(277, 56%, 68%)" offset="1"></stop>
        </linearGradient>
        <linearGradient
          id="lineGradient"
          gradientTransform="rotate(62, 0.5, 0.5)"
        >
          <stop stopColor="hsl(180, 69%, 40%)" offset="0"></stop>
          <stop stopColor="hsl(180, 69%, 60%)" offset="1"></stop>
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray}
        strokeOpacity="1"
      />
      {circlesVisible && (
        <>
          <circle
            cx={midX}
            cy={midY}
            r="8"
            fill="red"
            stroke="white"
            strokeWidth="2"
            style={{ cursor: "pointer" }}
            onClick={onDelete}
          />
          <circle
            cx={midX + 20}
            cy={midY}
            r="8"
            fill="blue"
            stroke="white"
            strokeWidth="2"
            style={{ cursor: "pointer" }}
            onClick={() =>
              onChangeStyle(
                connection.style === "straight" ? "curved" : "straight"
              )
            }
          />
        </>
      )}
    </g>
  );
};

export default Connection;
