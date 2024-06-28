// Toolbar.tsx
import React from "react";
import {
  FaEyeSlash,
  FaEye,
  FaMoon,
  FaSun,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

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
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
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
  isDarkMode,
  onToggleDarkMode,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div
      className={`${isDarkMode ? "bg-gray-800" : "bg-gray-200"} text-${
        isDarkMode ? "white" : "black"
      } p-4 flex justify-center space-x-4`}
    >
      <button
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
        onClick={onAddRectangle}
      >
        Add Topic
      </button>
      <button
        className={`px-4 py-2 rounded text-white ${
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
            selectedLineStyle === "straight"
              ? "bg-blue-500 text-white"
              : "bg-gray-500 text-white"
          }`}
          onClick={() => onSelectLineStyle("straight")}
        >
          Straight
        </button>
        <button
          className={`px-4 py-2 rounded ${
            selectedLineStyle === "curved"
              ? "bg-blue-500 text-white"
              : "bg-gray-500 text-white"
          }`}
          onClick={() => onSelectLineStyle("curved")}
        >
          Curved
        </button>
        <button
          className={`px-4 py-2 rounded ${
            isMultiSelectMode
              ? "bg-purple-500 text-white"
              : "bg-gray-500 text-white"
          }`}
          onClick={onToggleMultiSelect}
        >
          {isMultiSelectMode ? "Single Select" : "Multi Select"}
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
          onClick={onToggleCircleVisibility}
        >
          {circlesVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
          onClick={onToggleDarkMode}
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
          onClick={onZoomIn}
        >
          <FaPlus />
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
          onClick={onZoomOut}
        >
          <FaMinus />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
