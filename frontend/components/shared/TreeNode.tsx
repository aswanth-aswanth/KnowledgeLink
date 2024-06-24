// components/TreeNode.tsx
import React from 'react';
import { CalculatedTreeNode } from '../types/TreeTypes';

interface TreeNodeProps {
  node: CalculatedTreeNode;
  x: number;
  y: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, x, y }) => {
  const nodeWidth = 337.3;
  const nodeHeight = 47.3;

  return (
    <g>
      <g className="clickable-group" data-group-id={node.name}>
        <rect
          x={x - nodeWidth / 2}
          y={y}
          width={nodeWidth}
          height={nodeHeight}
          rx="2"
          fill="rgb(255,255,0)"
          fillOpacity="1"
          stroke="rgb(0,0,0)"
          strokeWidth="2.7"
        />
        <text
          x={x}
          y={y + nodeHeight / 2 + 5}
          fill="rgb(0,0,0)"
          fontSize="17px"
          textAnchor="middle"
        >
          {node.content}
        </text>
        <g transform={`translate(${x + nodeWidth / 2 - 20}, ${y + nodeHeight / 2 - 10})`}>
          <circle r="10" fill="rgb(56,118,29)" />
          <path
            d="M-5.5 0L-1.5 4 5 -2.5"
            fill="none"
            stroke="#fff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
      {node.children.map((child, index) => {
        const childX = x + (index - (node.children.length - 1) / 2) * 400;
        const childY = y + 150;

        return (
          <React.Fragment key={child.name}>
            <path
              d={`M${x} ${y + nodeHeight}Q${x} ${(y + childY) / 2} ${childX} ${childY}`}
              fill="none"
              stroke="rgb(43,120,228)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={index % 2 === 0 ? "0.8 12" : "undefined"}
            />
            <TreeNode node={child} x={childX} y={childY} />
          </React.Fragment>
        );
      })}
    </g>
  );
};

export default TreeNode;