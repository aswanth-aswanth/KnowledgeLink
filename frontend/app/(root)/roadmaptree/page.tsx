// pages/index.tsx
import React from "react";
import TreeDiagram from "../../../components/shared/TreeDiagram";
import { TreeNode } from "../../../types/TreeTypes";

const Home: React.FC = () => {
  const data: TreeNode = {
    name: "JavaScript Basics",
    content: "Introduction to JavaScript",
    children: [
      {
        name: "Variables and Data Types",
        content: "Understanding variables and data types in JavaScript",
        children: [
          {
            name: "Primitive Types",
            content: "Detailed explanation of primitive types",
            children: [],
          },
          {
            name: "Reference Types",
            content: "Detailed explanation of reference types",
            children: [],
          },
        ],
      },
      {
        name: "Functions",
        content: "Introduction to functions in JavaScript",
        children: [
          {
            name: "Function Declarations",
            content: "Understanding function declarations",
            children: [],
          },
          {
            name: "Function Expressions",
            content: "Understanding function expressions",
            children: [],
          },
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">JavaScript Learning Tree</h1>
      <TreeDiagram data={data} />
    </div>
  );
};

export default Home;
