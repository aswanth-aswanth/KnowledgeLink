import React from "react";

interface ConnectionProps {
  connection: {
    from: string;
    to: string;
    style: "straight" | "curved";
  };
  circlesVisible: boolean;
  rectangles: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  onDelete: () => void;
  onChangeStyle: (style: "straight" | "curved") => void;
}

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
    const curveY1 = startY - 88; // Adjust this value to increase the curvature
    const curveX2 = endX - (endX - midX) / 2;
    const curveY2 = endY + 90; // Adjust this value to increase the curvature
    pathD = `M${startX},${startY} C${curveX1},${curveY1} ${curveX2},${curveY2} ${endX},${endY}`;
    strokeDasharray = "0 0";
    stroke = "url(#straightLineGradient)";
    strokeWidth = "7";
  } else {
    const curveX1 = startX + (midX - startX) / 2;
    const curveY1 = startY;
    const curveX2 = endX - (endX - midX) / 2;
    const curveY2 = endY;
    pathD = `M${startX},${startY} Q${curveX1},${curveY1} ${midX},${midY} T${endX},${endY}`;
    strokeDasharray = "0.8 12";
    stroke = "rgb(43,120,228)";
    strokeWidth = "4";
  }

  return (
    <g>
      <defs>
        <linearGradient id="straightLineGradient">
          <stop stopColor="hsl(180, 78%, 61%)" offset="0"></stop>
          <stop stopColor="hsl(277, 56%, 68%)" offset="1"></stop>
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
