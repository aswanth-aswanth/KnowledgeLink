import React from "react";

interface ConnectionProps {
  connection: {
    from: string;
    to: string;
  };
  rectangles: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  onDelete: () => void;
}

const Connection: React.FC<ConnectionProps> = ({
  connection,
  rectangles,
  onDelete,
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

  const curveX1 = startX + (midX - startX) / 2;
  const curveY1 = startY;
  const curveX2 = endX - (endX - midX) / 2;
  const curveY2 = endY;

  const pathD = `M${startX},${startY} Q${curveX1},${curveY1} ${midX},${midY} T${endX},${endY}`;

  return (
    <g>
      <path
        d={pathD}
        fill="none"
        stroke="rgb(43,120,228)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.8 12"
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
    </g>
  );
};

export default Connection;
