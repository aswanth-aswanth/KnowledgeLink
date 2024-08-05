import React from "react";
import { FaEyeSlash, FaEye, FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import { ToolbarProps } from "@/types/roadmap";

const Toolbar: React.FC<ToolbarProps> = ({
  onSelectLineStyle,
  selectedLineStyle,
  isMultiSelectMode,
  onToggleMultiSelect,
  circlesVisible,
  onToggleCircleVisibility,
  onCopySVG,
  onScaleUp,
  onScaleDown,
  onToggleConnecting,
  isConnectingMode,
}) => {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-center space-x-4">
      <button
        className={`px-4 py-2 rounded ${
          isConnectingMode
            ? "bg-green-500 hover:bg-green-600"
            : "bg-yellow-500 hover:bg-yellow-600"
        }`}
        onClick={onToggleConnecting}
      >
        {isConnectingMode ? "Stop Connecting" : "Start Connecting"}
      </button>
      <div className="flex select-none space-x-2">
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
        <button
          className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
          onClick={onCopySVG}
        >
          Copy SVG
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
          onClick={onScaleUp}
        >
          <FaSearchPlus />
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
          onClick={onScaleDown}
        >
          <FaSearchMinus />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
