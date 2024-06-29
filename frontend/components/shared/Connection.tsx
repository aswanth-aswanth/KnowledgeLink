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

  const pathD =
    connection.style === "straight"
      ? `M${startX},${startY} L${endX},${endY}`
      : `M${startX},${startY} C${startX + (endX - startX) * 0.25},${
          startY + (endY - startY) * 0.1
        } ${startX + (endX - startX) * 0.75},${
          endY - (endY - startY) * 0.1
        } ${endX},${endY}`;

  return (
    <g>
      <defs>
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
        stroke="url(#lineGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="10 8"
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
