"use client";
import React, { useRef, useEffect } from "react";
import { useEditor } from "./hooks/useEditor";
import { createRectanglesFromData } from "./utils/editorHelpers";
import { handleCopySVG } from "./utils/svgHelpers";
import Rectangle from "./components/Rectangle";
import Connection from "./components/Connection";
import Toolbar from "./components/Toolbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import apiClient from "@/api/apiClient";
import toast from "react-hot-toast";

const Editor: React.FC = () => {
  const {
    rectangles,
    setRectangles,
    connections,
    setConnections,
    selectedRect,
    setSelectedRect,
    currentLineStyle,
    isConnectingMode,
    setCurrentLineStyle,
    isConnecting,
    setIsConnecting,
    connectionStart,
    setConnectionStart,
    isDragging,
    setIsDragging,
    dragStart,
    setDragStart,
    svgHeight,
    setSvgHeight,
    selectedRects,
    setSelectedRects,
    isMultiSelectMode,
    setIsMultiSelectMode,
    circlesVisible,
    setCirclesVisible,
    scale,
    setScale,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    handleCreateConnection,
    handleSelectLineStyle,
    handleChangeConnectionStyle,
    updateSvgHeight,
    handleUpdateRectPosition,
    handleUpdateRectSize,
    handleDeleteRect,
    handleStartConnecting,
    handleRectInteraction,
    handleScaleUp,
    handleScaleDown,
  } = useEditor();

  const svgRef = useRef<SVGSVGElement>(null);
  const editorData = useSelector((state: RootState) => state.topics.editorData);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (editorData && rectangles.length === 0) {
      const initialRectangles = createRectanglesFromData(editorData.topics);
      setRectangles(initialRectangles);
    }
    updateSvgHeight();
  }, [editorData, rectangles.length, setRectangles, updateSvgHeight]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleSubmitRoadmap = async () => {
    if (isAuthenticated) {
      try {
        const formData = new FormData();

        const jsonData = JSON.stringify({
          editorData: {
            title: editorData.title,
            description: editorData.description,
            type: editorData.type,
            topics: editorData.topics,
            members: editorData.members,
            uniqueId: editorData.uniqueId,
          },
          rectanglesData: {
            roadmapUniqueId: editorData.uniqueId,
            rectangles: rectangles,
          },
          connectionsData: {
            roadmapUniqueId: editorData.uniqueId,
            connections: connections,
          },
        });

        formData.append("data", jsonData);

        editorData.mediaFiles.forEach((mediaFile: any, index: any) => {
          if (mediaFile.file instanceof File) {
            formData.append(
              `file${index}`,
              mediaFile.file,
              mediaFile.file.name
            );
          }
        });

        const response = await apiClient.post("/roadmap", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast(response.data.message, {
          icon: "👏",
        });
      } catch (error) {
        console.error("Error : ", error);
        toast.error("An unexpected error occurred");
      }
    } else {
      toast.error("You need to login!!!");
    }
  };

  return (
    <div className="relative">
      <Toolbar
        onToggleConnecting={handleStartConnecting}
        isConnectingMode={isConnectingMode}
        onSelectLineStyle={handleSelectLineStyle}
        selectedLineStyle={currentLineStyle}
        isMultiSelectMode={isMultiSelectMode}
        onToggleMultiSelect={() => setIsMultiSelectMode((prev) => !prev)}
        circlesVisible={circlesVisible}
        onToggleCircleVisibility={() => setCirclesVisible((prev) => !prev)}
        onCopySVG={() => handleCopySVG(svgRef)}
        onScaleUp={handleScaleUp}
        onScaleDown={handleScaleDown}
      />
      <svg
        ref={svgRef}
        width="100%"
        height={svgHeight}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        className="p-4"
        style={{ transform: `scale(${scale})`, transformOrigin: "top" }}
      >
        {connections.map((conn, index) => (
          <Connection
            key={index}
            connection={conn}
            rectangles={rectangles}
            onDelete={() =>
              setConnections(connections.filter((_, i) => i !== index))
            }
            onChangeStyle={(style) => handleChangeConnectionStyle(index, style)}
            circlesVisible={circlesVisible}
          />
        ))}

        {rectangles.map((rect) => (
          <Rectangle
            key={rect.id}
            rect={rect}
            isSelected={
              isMultiSelectMode
                ? selectedRects.includes(rect.id)
                : rect.id === selectedRect
            }
            onSelect={(e) => handleRectInteraction(rect.id, e)}
            onUpdatePosition={(newX, newY) =>
              handleUpdateRectPosition(rect.id, newX, newY)
            }
            onUpdateSize={(newWidth, newHeight) =>
              handleUpdateRectSize(rect.id, newWidth, newHeight)
            }
            onDelete={() => handleDeleteRect(rect.id)}
            circlesVisible={circlesVisible}
          />
        ))}
      </svg>
      <button
        onClick={handleSubmitRoadmap}
        className="absolute bottom-8 right-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 ease-in-out"
      >
        Submit roadmap
      </button>
    </div>
  );
};

export default Editor;
