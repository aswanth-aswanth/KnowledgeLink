import React from "react";

interface ConnectionProps {
  connection: {
    from: string;
    to: string;
    style: "straight" | "curved";
  };
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
          onChangeStyle(connection.style === "straight" ? "curved" : "straight")
        }
      />
    </g>
  );
};

export default Connection;
