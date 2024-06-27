"use client";
import React, { useState, useRef, useCallback } from "react";
import Rectangle from "./Rectangle";
import Toolbar from "./Toolbar";
import Connection from "./Connection";

interface Rect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ConnectionType {
  from: string;
  to: string;
}

const Editor: React.FC = () => {
  const [rectangles, setRectangles] = useState<Rect[]>([
    { id: "rect1", x: 50, y: 50, width: 100, height: 50 },
    { id: "rect2", x: 200, y: 50, width: 100, height: 50 },
    { id: "rect3", x: 350, y: 50, width: 100, height: 50 },
  ]);
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [selectedRect, setSelectedRect] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleSelectRect = (id: string) => {
    setSelectedRect(id);
  };

  const handleUpdateRectPosition = useCallback(
    (id: string, newX: number, newY: number) => {
      setRectangles((rects) =>
        rects.map((rect) =>
          rect.id === id ? { ...rect, x: newX, y: newY } : rect
        )
      );
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (isDragging && selectedRect) {
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          const newX = e.clientX - svgRect.left - dragOffset.x;
          const newY = e.clientY - svgRect.top - dragOffset.y;
          handleUpdateRectPosition(selectedRect, newX, newY);
        }
      }
    },
    [isDragging, selectedRect, handleUpdateRectPosition, dragOffset]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (e.button === 0 && selectedRect) {
        const svgRect = svgRef.current?.getBoundingClientRect();
        const rect = rectangles.find((r) => r.id === selectedRect);
        if (svgRect && rect) {
          const offsetX = e.clientX - svgRect.left - rect.x;
          const offsetY = e.clientY - svgRect.top - rect.y;
          setDragOffset({ x: offsetX, y: offsetY });
        }
        setIsDragging(true);
      }
    },
    [selectedRect, rectangles]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleUpdateRectSize = useCallback(
    (id: string, newWidth: number, newHeight: number) => {
      setRectangles((rects) =>
        rects.map((rect) =>
          rect.id === id
            ? { ...rect, width: newWidth, height: newHeight }
            : rect
        )
      );
    },
    []
  );

  const handleDeleteRect = (id: string) => {
    setRectangles((rects) => rects.filter((rect) => rect.id !== id));
    setConnections((conns) =>
      conns.filter((conn) => conn.from !== id && conn.to !== id)
    );
    if (selectedRect === id) {
      setSelectedRect(null);
    }
  };

  const handleCreateRect = () => {
    const newRect: Rect = {
      id: `rect${rectangles.length + 1}`,
      x: 100,
      y: 100,
      width: 100,
      height: 50,
    };
    setRectangles([...rectangles, newRect]);
  };

  // const handleCreateConnection = (from: string, to: string) => {
  //   const newConnection: ConnectionType = { from, to };
  //   setConnections([...connections, newConnection]);
  // };

  const handleStartConnecting = () => {
    setIsConnecting(true);
  };

  const handleCreateConnection = () => {
    if (connectionStart && selectedRect && connectionStart !== selectedRect) {
      const newConnection: ConnectionType = {
        from: connectionStart,
        to: selectedRect,
      };
      setConnections([...connections, newConnection]);
      setIsConnecting(false);
      setConnectionStart(null);
    }
  };

  const handleRectClick = (id: string) => {
    if (isConnecting) {
      if (!connectionStart) {
        setConnectionStart(id);
      } else {
        handleCreateConnection();
      }
    }
    setSelectedRect(id);
  };

  return (
    <div>
      {/* <Toolbar onAddRectangle={handleCreateRect} /> */}
      <Toolbar
        onAddRectangle={handleCreateRect}
        onStartConnecting={handleStartConnecting}
        isConnecting={isConnecting}
        onCreateConnection={handleCreateConnection}
      />
      <svg
        ref={svgRef}
        width="100%"
        height="600px"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
      >
        {rectangles.map((rect) => (
          <Rectangle
            key={rect.id}
            rect={rect}
            isSelected={rect.id === selectedRect}
            onSelect={() => handleRectClick(rect.id)}
            onUpdatePosition={(newX, newY) =>
              handleUpdateRectPosition(rect.id, newX, newY)
            }
            onUpdateSize={(newWidth, newHeight) =>
              handleUpdateRectSize(rect.id, newWidth, newHeight)
            }
            onDelete={() => handleDeleteRect(rect.id)}
          />
        ))}
        {connections.map((conn, index) => (
          <Connection
            key={index}
            connection={conn}
            rectangles={rectangles}
            onDelete={() => {
              setConnections(connections.filter((_, i) => i !== index));
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default Editor;
