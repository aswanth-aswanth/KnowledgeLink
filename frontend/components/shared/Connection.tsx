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

  if (connection.style === "straight") {
    pathD = `M${startX},${startY} L${endX},${endY}`;
    strokeDasharray = "-1.2 12";
  } else {
    const curveX1 = startX + (midX - startX) / 2;
    const curveY1 = startY;
    const curveX2 = endX - (endX - midX) / 2;
    const curveY2 = endY;
    pathD = `M${startX},${startY} Q${curveX1},${curveY1} ${midX},${midY} T${endX},${endY}`;
    strokeDasharray = "0.8 12";
  }

  return (
    <g>
      <path
        d={pathD}
        fill="none"
        stroke="rgb(43,120,228)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={strokeDasharray}
      />
      {circlesVisible && (
        <>
          <g onClick={onDelete} style={{ cursor: "pointer" }}>
            <circle
              cx={midX}
              cy={midY}
              r="10"
              fill="#ff4d4d"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <path
              d="M-4,-4 L4,4 M-4,4 L4,-4"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`translate(${midX}, ${midY})`}
            />
            <title>Delete connection</title>
          </g>

          <g
            onClick={() =>
              onChangeStyle(
                connection.style === "straight" ? "curved" : "straight"
              )
            }
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={midX + 25}
              cy={midY}
              r="10"
              fill="#4d79ff"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <path
              d={
                connection.style === "straight"
                  ? "M-4,4 Q0,-4 4,4"
                  : "M-4,0 L4,0"
              }
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`translate(${midX + 25}, ${midY})`}
            />
            <title>Change connection style</title>
          </g>
        </>
      )}
    </g>
  );
};

export default Connection;
