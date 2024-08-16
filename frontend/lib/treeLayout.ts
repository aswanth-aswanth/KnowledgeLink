// utils/treeLayout.ts
import { TreeNode, CalculatedTreeNode } from '../types/TreeTypes';

export const calculateTreeLayout = (node: TreeNode, depth = 0): CalculatedTreeNode => {
  const newNode: CalculatedTreeNode = { ...node, depth, children: [] };
  if (node.children) {
    newNode.children = node.children.map(child => calculateTreeLayout(child, depth + 1));
  }
  return newNode;
};