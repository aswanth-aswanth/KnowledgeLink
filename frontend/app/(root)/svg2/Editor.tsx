"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Rectangle from "../../../components/shared/Rectangle";
import Toolbar from "../../../components/shared/Toolbar";
import Connection from "../../../components/shared/Connection";
import { topicsData } from "@/data/topic";
import { Topic, Rect, ConnectionType } from "@/types/EditorTypes";
import { useEditorContext } from "@/contexts/EditorContext";
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
    isInitialized,
  } = useEditorContext();
  const [selectedRect, setSelectedRect] = useState<string | null>(null);
  const [currentLineStyle, setCurrentLineStyle] = useState<
    "straight" | "curved"
  >("straight");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [svgHeight, setSvgHeight] = useState(600);
  const [selectedRects, setSelectedRects] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [circlesVisible, setCirclesVisible] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const editorData = useSelector((state: RootState) => state.topics.editorData);
  const [scale, setScale] = useState(1);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  console.log("EditorData : ", editorData);

  const toggleCircleVisibility = () => setCirclesVisible((prev) => !prev);

  const createRectanglesFromData = useCallback(
    (
      topic: Topic,
      level: number = 0,
      yOffset: number = 0,
      existingRects: Rect[] = []
    ) => {
      const newRects: Rect[] = [];
      const rectWidth = 180;
      const rectHeight = 40;
      const xOffset = level * 250;
      console.log("Topics Editor: ", topic);
      const existingRect = existingRects.find((r) => r.id === topic?.uniqueId);
      const rect: Rect = existingRect || {
        id: `${topic.uniqueId}`,
        x: xOffset,
        y: yOffset,
        width: rectWidth,
        height: rectHeight,
        name: topic?.name,
        uniqueId: `${topic.uniqueId}`,
      };
      newRects.push(rect);

      let currentYOffset = yOffset + rectHeight + 20;
      topic?.children.forEach((child) => {
        const childRects = createRectanglesFromData(
          child,
          level + 1,
          currentYOffset,
          existingRects
        );
        newRects.push(...childRects);
        currentYOffset += childRects.length * (rectHeight + 20);
      });

      return newRects;
    },
    []
  );

  useEffect(() => {
    if (isInitialized) {
      if (rectangles.length === 0) {
        const initialRectangles = createRectanglesFromData(editorData.topics);
        setRectangles(initialRectangles);
      } else {
        console.log("topics DAtata : ", topicsData);
        // Ensure all topics from topicsData are represented in rectangles
        const updatedRectangles = createRectanglesFromData(
          editorData.topics,
          0,
          0,
          rectangles
        );
        // Only update if there are new rectangles
        if (updatedRectangles.length !== rectangles.length) {
          setRectangles(updatedRectangles);
        }
      }
      updateSvgHeight();
    }
  }, [isInitialized, rectangles, setRectangles, createRectanglesFromData]);

  const handleCopySVG = () => {
    if (svgRef.current) {
      // Get the outer HTML of the SVG element
      const svgContent = svgRef.current.outerHTML;

      // Create a Blob with the SVG content
      const blob = new Blob([svgContent], { type: "image/svg+xml" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;
      link.download = "diagram.svg";

      // Programmatically click the link to trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleSelectRect = (id: string, event: React.MouseEvent) => {
    if (isMultiSelectMode) {
      if (event.ctrlKey) {
        setSelectedRects((prev) =>
          prev.includes(id)
            ? prev.filter((rectId) => rectId !== id)
            : [...prev, id]
        );
      } else {
        setSelectedRects([id]);
      }
    } else {
      setSelectedRect(id);
    }
  };

  const handleScaleUp = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  };

  const handleScaleDown = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 0 && svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top,
      });
      setIsDragging(true);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (
        isDragging &&
        (selectedRect || selectedRects.length > 0) &&
        svgRef.current
      ) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const dx = e.clientX - svgRect.left - dragStart.x;
        const dy = e.clientY - svgRect.top - dragStart.y;

        setRectangles((prevRects) =>
          prevRects.map((rect) =>
            (isMultiSelectMode && selectedRects.includes(rect.id)) ||
            (!isMultiSelectMode && rect.id === selectedRect)
              ? { ...rect, x: rect.x + dx, y: rect.y + dy }
              : rect
          )
        );

        setDragStart({
          x: e.clientX - svgRect.left,
          y: e.clientY - svgRect.top,
        });
      }
    },
    [isDragging, selectedRect, selectedRects, isMultiSelectMode, dragStart]
  );

  const handleMouseUp = () => setIsDragging(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        if (selectedRects.length === rectangles.length) {
          setSelectedRects([]);
        } else {
          setSelectedRects(rectangles.map((rect) => rect.id));
        }
      }
    },
    [rectangles, selectedRects]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleCreateConnection = () => {
    if (connectionStart && selectedRect && connectionStart !== selectedRect) {
      const newConnection: ConnectionType = {
        from: connectionStart,
        to: selectedRect,
        style: currentLineStyle,
      };
      setConnections([...connections, newConnection]);
      setIsConnecting(false);
      setConnectionStart(null);
      setSelectedRect(null);
    }
  };

  const handleSelectLineStyle = (style: "straight" | "curved") =>
    setCurrentLineStyle(style);

  const handleChangeConnectionStyle = (
    index: number,
    style: "straight" | "curved"
  ) => {
    setConnections(
      connections.map((conn, i) => (i === index ? { ...conn, style } : conn))
    );
  };

  const updateSvgHeight = useCallback(() => {
    const maxY = Math.max(...rectangles.map((rect) => rect.y + rect.height));
    const newHeight = Math.max(600, maxY + 100); // Add some padding
    setSvgHeight(newHeight);
  }, [rectangles]);

  const handleUpdateRectPosition = useCallback(
    (id: string, newX: number, newY: number) => {
      setRectangles((rects) =>
        rects.map((rect) =>
          rect.id === id ? { ...rect, x: newX, y: newY } : rect
        )
      );
      updateSvgHeight();
    },
    [updateSvgHeight]
  );

  const handleUpdateRectSize = useCallback(
    (id: string, newWidth: number, newHeight: number) => {
      setRectangles((rects) =>
        rects.map((rect) =>
          rect.id === id
            ? { ...rect, width: newWidth, height: newHeight }
            : rect
        )
      );
      updateSvgHeight();
    },
    [updateSvgHeight]
  );

  const handleDeleteRect = (id: string) => {
    setRectangles((rects) => rects.filter((rect) => rect.id !== id));
    setConnections((conns) =>
      conns.filter((conn) => conn.from !== id && conn.to !== id)
    );
    if (selectedRect === id) setSelectedRect(null);
  };

  const handleStartConnecting = () => setIsConnecting(true);

  const handleRectInteraction = (id: string, event: React.MouseEvent) => {
    if (isConnecting) {
      if (!connectionStart) {
        setConnectionStart(id);
      } else {
        setSelectedRect(id);
        handleCreateConnection();
      }
    } else {
      handleSelectRect(id, event);
    }
  };

  console.log("Editor Data");

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

        // Append media files
        editorData.mediaFiles.forEach((mediaFile, index) => {
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

        console.log("response : ", response.data);
        toast(response.data.message, {
          icon: "👏",
        });
      } catch (error) {
        console.log("Error : ", error);
        toast.error("An unexpected error occurred");
      }
    } else {
      toast.error("You need to login!!!");
    }
  };

  useEffect(() => updateSvgHeight(), [rectangles, updateSvgHeight]);

  return (
    <div className="relative">
      <Toolbar
        onStartConnecting={handleStartConnecting}
        isConnecting={isConnecting}
        onCreateConnection={handleCreateConnection}
        onSelectLineStyle={handleSelectLineStyle}
        selectedLineStyle={currentLineStyle}
        isMultiSelectMode={isMultiSelectMode}
        onToggleMultiSelect={() => setIsMultiSelectMode((prev) => !prev)}
        circlesVisible={circlesVisible}
        onToggleCircleVisibility={toggleCircleVisibility}
        onCopySVG={handleCopySVG}
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
