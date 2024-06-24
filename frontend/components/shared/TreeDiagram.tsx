// components/TreeDiagram.tsx
import React from "react";
import TreeNode from "./TreeNode";
import { calculateTreeLayout } from "../../utils/treeLayout";
import { TreeNode as TreeNodeType } from "../../types/TreeTypes";

interface TreeDiagramProps {
  data: TreeNodeType;
}

const TreeDiagram: React.FC<TreeDiagramProps> = ({ data }) => {
  const treeData = calculateTreeLayout(data);

  return (
    <svg width="1000" height="600">
      <TreeNode node={treeData} x={500} y={50} />
    </svg>
  );
};

export default TreeDiagram;
