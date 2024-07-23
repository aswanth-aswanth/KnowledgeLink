import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "@/store";
import { useEditor } from "./hooks/useEditor";
import { createRectanglesFromData } from "./utils/editorHelpers";
import { handleCopySVG } from "./utils/svgHelpers";
import Rectangle from "./components/Rectangle";
import Connection from "./components/Connection";
import Toolbar from "./components/Toolbar";
import apiClient from "@/api/apiClient";
import toast from "react-hot-toast";
import {
  setRectangles,
  setConnections,
  setSelectedRect,
  setCurrentLineStyle,
  setIsConnectingMode,
  setIsMultiSelectMode,
  setCirclesVisible,
  setScale,
  updateRectPosition,
  updateRectSize,
  deleteRect,
  addConnection,
  deleteConnection,
  updateConnectionStyle,
} from '@/store/editorSlice';

const Editor: React.FC = () => {
  const dispatch = useDispatch();
  const editorState = useSelector((state: RootState) => state.editor);
  const editorData = useSelector((state: RootState) => state.topics.editorData);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    handleCreateConnection,
    handleStartConnecting,
    handleRectInteraction,
    handleScaleUp,
    handleScaleDown,
    updateSvgHeight,
  } = useEditor();

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (editorData && editorState.rectangles.length === 0) {
      const initialRectangles = createRectanglesFromData(editorData.topics);
      dispatch(setRectangles(initialRectangles));
    }
    updateSvgHeight();
  }, [editorData, editorState.rectangles.length, dispatch, updateSvgHeight]);

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
            rectangles: editorState.rectangles,
          },
          connectionsData: {
            roadmapUniqueId: editorData.uniqueId,
            connections: editorState.connections,
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
        isConnectingMode={editorState.isConnectingMode}
        onSelectLineStyle={(style) => dispatch(setCurrentLineStyle(style))}
        selectedLineStyle={editorState.currentLineStyle}
        isMultiSelectMode={editorState.isMultiSelectMode}
        onToggleMultiSelect={() => dispatch(setIsMultiSelectMode(!editorState.isMultiSelectMode))}
        circlesVisible={editorState.circlesVisible}
        onToggleCircleVisibility={() => dispatch(setCirclesVisible(!editorState.circlesVisible))}
        onCopySVG={() => handleCopySVG(svgRef)}
        onScaleUp={handleScaleUp}
        onScaleDown={handleScaleDown}
      />
      <svg
        ref={svgRef}
        width="100%"
        height={updateSvgHeight()}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        className="p-4"
        style={{ transform: `scale(${editorState.scale})`, transformOrigin: "top" }}
      >
        {editorState.connections.map((conn, index) => (
          <Connection
            key={index}
            connection={conn}
            rectangles={editorState.rectangles}
            onDelete={() => dispatch(deleteConnection(index))}
            onChangeStyle={(style) => dispatch(updateConnectionStyle({ index, style }))}
            circlesVisible={editorState.circlesVisible}
          />
        ))}

        {editorState.rectangles.map((rect) => (
          <Rectangle
            key={rect.id}
            rect={rect}
            isSelected={
              editorState.isMultiSelectMode
                ? editorState.selectedRect?.includes(rect.id)
                : rect.id === editorState.selectedRect
            }
            onSelect={(e) => handleRectInteraction(rect.id, e)}
            onUpdatePosition={(newX, newY) =>
              dispatch(updateRectPosition({ id: rect.id, x: newX, y: newY }))
            }
            onUpdateSize={(newWidth, newHeight) =>
              dispatch(updateRectSize({ id: rect.id, width: newWidth, height: newHeight }))
            }
            onDelete={() => dispatch(deleteRect(rect.id))}
            circlesVisible={editorState.circlesVisible}
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