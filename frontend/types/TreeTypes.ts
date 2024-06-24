// types/TreeTypes.ts
export interface TreeNode {
    name: string;
    content: string;
    children: TreeNode[];
  }
  
  export interface CalculatedTreeNode extends TreeNode {
    depth: number;
    children: CalculatedTreeNode[];
  }