"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Toolbar from "./Toolbar";
import Rectangle from "./Rectangle";
import Connection from "./Connection";

interface Rect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Conn {
  id: string;
  from: string;
  to: string;
}

const Editor: React.FC = () => {
  const [rectangles, setRectangles] = useState<Rect[]>([
    { id: "1", x: 100, y: 100, width: 100, height: 60 },
    { id: "2", x: 250, y: 200, width: 100, height: 60 },
    { id: "3", x: 400, y: 100, width: 100, height: 60 },
  ]);
  const [connections, setConnections] = useState<Conn[]>([]);
  const [selectedRect, setSelectedRect] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleAddRectangle = useCallback(() => {
    const newRect: Rect = {
      id: Date.now().toString(),
      x: Math.random() * 500,
      y: Math.random() * 300,
      width: 100,
      height: 60,
    };
    setRectangles((prev) => [...prev, newRect]);
  }, []);

  const handleSelectRect = useCallback((id: string) => {
    setSelectedRect(id);
  }, []);

  const handleStartConnecting = useCallback(() => {
    setIsConnecting(true);
    setSelectedRect(null);
  }, []);

  const handleCreateConnection = useCallback(() => {
    if (selectedRect && isConnecting) {
      const newConn: Conn = {
        id: Date.now().toString(),
        from: selectedRect,
        to: rectangles.find((r) => r.id !== selectedRect)?.id || "",
      };
      setConnections((prev) => [...prev, newConn]);
      setIsConnecting(false);
      setSelectedRect(null);
    }
  }, [selectedRect, isConnecting, rectangles]);

  const handleDeleteConnection = useCallback((id: string) => {
    setConnections((prev) => prev.filter((conn) => conn.id !== id));
  }, []);

  const handleUpdateRectPosition = useCallback(
    (id: string, newX: number, newY: number) => {
      setRectangles((prev) =>
        prev.map((rect) =>
          rect.id === id ? { ...rect, x: newX, y: newY } : rect
        )
      );
    },
    []
  );

  const handleUpdateRectSize = useCallback(
    (id: string, newWidth: number, newHeight: number) => {
      setRectangles((prev) =>
        prev.map((rect) =>
          rect.id === id
            ? { ...rect, width: newWidth, height: newHeight }
            : rect
        )
      );
    },
    []
  );

  const handleDeleteRect = useCallback((id: string) => {
    setRectangles((prev) => prev.filter((rect) => rect.id !== id));
    setConnections((prev) =>
      prev.filter((conn) => conn.from !== id && conn.to !== id)
    );
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (isDragging && selectedRect) {
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          console.log("svgRect : ", svgRect);
          const newX = e.clientX - svgRect.left;
          const newY = e.clientY - svgRect.top;
          // console.log("SelectedRect : ", selectedRect);
          // console.log("newX : ",newX);
          // console.log("newY : ",newY);
          handleUpdateRectPosition(selectedRect, newX, newY);
        }
      }
    },
    [isDragging, selectedRect, handleUpdateRectPosition]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (e.button === 2 && selectedRect) {
        // Right mouse button
        setIsDragging(true);
      }
    },
    [selectedRect]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      svg.addEventListener("mousemove", handleMouseMove as any);
      svg.addEventListener("mousedown", handleMouseDown as any);
      svg.addEventListener("mouseup", handleMouseUp);
      svg.addEventListener("contextmenu", (e) => e.preventDefault());
      return () => {
        svg.removeEventListener("mousemove", handleMouseMove as any);
        svg.removeEventListener("mousedown", handleMouseDown as any);
        svg.removeEventListener("mouseup", handleMouseUp);
        svg.removeEventListener("contextmenu", (e) => e.preventDefault());
      };
    }
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

  return (
    <div className="w-full h-screen flex flex-col">
      <Toolbar
        onAddRectangle={handleAddRectangle}
        onStartConnecting={handleStartConnecting}
        isConnecting={isConnecting}
        onCreateConnection={handleCreateConnection}
      />
      <svg
        ref={svgRef}
        className="flex-grow bg-white"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      >
        {connections.map((conn) => (
          <Connection
            key={conn.id}
            connection={conn}
            rectangles={rectangles}
            onDelete={() => handleDeleteConnection(conn.id)}
          />
        ))}
        {rectangles.map((rect) => (
          <Rectangle
            key={rect.id}
            rect={rect}
            isSelected={selectedRect === rect.id}
            onSelect={() => handleSelectRect(rect.id)}
            onUpdatePosition={(newX, newY) =>
              handleUpdateRectPosition(rect.id, newX, newY)
            }
            onUpdateSize={(newWidth, newHeight) =>
              handleUpdateRectSize(rect.id, newWidth, newHeight)
            }
            onDelete={() => handleDeleteRect(rect.id)}
          />
        ))}
      </svg>
    </div>
  );
};

export default Editor;
