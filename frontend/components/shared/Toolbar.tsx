// Toolbar.tsx
import React from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";

interface ToolbarProps {
  onAddRectangle: () => void;
  onStartConnecting: () => void;
  isConnecting: boolean;
  onCreateConnection: () => void;
  onSelectLineStyle: (style: "straight" | "curved") => void;
  selectedLineStyle: "straight" | "curved";
  isMultiSelectMode: boolean;
  onToggleMultiSelect: () => void;
  circlesVisible: boolean;
  onToggleCircleVisibility: () => void;
  onCopySVG: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddRectangle,
  onStartConnecting,
  isConnecting,
  onCreateConnection,
  onSelectLineStyle,
  selectedLineStyle,
  isMultiSelectMode,
  onToggleMultiSelect,
  circlesVisible,
  onToggleCircleVisibility,
  onCopySVG,
}) => {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-center space-x-4">
      <button
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        onClick={onAddRectangle}
      >
        Add Rectangle
      </button>
      <button
        className={`px-4 py-2 rounded ${
          isConnecting
            ? "bg-green-500 hover:bg-green-600"
            : "bg-yellow-500 hover:bg-yellow-600"
        }`}
        onClick={isConnecting ? onCreateConnection : onStartConnecting}
      >
        {isConnecting ? "Create Connection" : "Start Connecting"}
      </button>
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded ${
            selectedLineStyle === "straight" ? "bg-blue-500" : "bg-gray-500"
          }`}
          onClick={() => onSelectLineStyle("straight")}
        >
          New Straight Line
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedLineStyle === "curved" ? "bg-blue-500" : "bg-gray-500"
          }`}
          onClick={() => onSelectLineStyle("curved")}
        >
          New Curved Line
        </button>
        <button
          className={`px-4 py-2 rounded ${
            isMultiSelectMode ? "bg-purple-500" : "bg-gray-500"
          }`}
          onClick={onToggleMultiSelect}
        >
          {isMultiSelectMode ? "Disable Multi-Select" : "Enable Multi-Select"}
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
          onClick={onToggleCircleVisibility}
        >
          {circlesVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
        <button onClick={onCopySVG}>Copy SVG</button>
      </div>
    </div>
  );
};

export default Toolbar;
