import { RectangleProps } from '@/types/roadmap';
import React from 'react';

const Rectangle: React.FC<RectangleProps> = ({
  rect,
  isSelected,
  onSelect,
  onUpdatePosition,
  onUpdateSize,
  onDelete,
  circlesVisible,
}) => {
  return (
    <g>
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill=""
        stroke={isSelected ? 'blue' : 'black'}
        strokeWidth="0.4"
        rx="2"
        ry="2"
        onClick={onSelect}
        style={{ cursor: 'pointer' }}
        className="fill-slate-50 dark:fill-slate-200"
      />
      <text
        x={rect.x + rect.width / 2}
        y={rect.y + rect.height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        onClick={onSelect}
        style={{ cursor: 'pointer' }}
      >
        {rect.name}
      </text>
    </g>
  );
};

export default Rectangle;
