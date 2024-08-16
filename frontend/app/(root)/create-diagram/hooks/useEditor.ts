import { useState, useCallback } from 'react';
import { Rect, ConnectionType } from '@/types/EditorTypes';

export const useEditor = () => {
  const [rectangles, setRectangles] = useState<Rect[]>([]);
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [selectedRect, setSelectedRect] = useState<string | null>(null);
  const [currentLineStyle, setCurrentLineStyle] = useState<"straight" | "curved">("straight");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [isConnectingMode, setIsConnectingMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [svgHeight, setSvgHeight] = useState(600);
  const [selectedRects, setSelectedRects] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [circlesVisible, setCirclesVisible] = useState(true);
  const [scale, setScale] = useState(1);

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 0) {
      const svgRect = e.currentTarget.getBoundingClientRect();
      setDragStart({
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top,
      });
      setIsDragging(true);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (isDragging && (selectedRect || selectedRects.length > 0)) {
        const svgRect = e.currentTarget.getBoundingClientRect();
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
    const newHeight = Math.max(600, maxY + 100);
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

  const handleStartConnecting = () => {
    setIsConnectingMode(prev => !prev);
    setSelectedRect(null);
    setConnectionStart(null);
  };

  const handleRectInteraction = (id: string, event: React.MouseEvent) => {
    if (isConnectingMode) {
      if (!connectionStart) {
        setConnectionStart(id);
      } else if (connectionStart !== id) {
        const newConnection: ConnectionType = {
          from: connectionStart,
          to: id,
          style: currentLineStyle,
        };
        setConnections(prev => [...prev, newConnection]);
        setConnectionStart(null);
      }
    } else if (isMultiSelectMode) {
      if (selectedRect === null) {
        setSelectedRect(id);
      } else if (selectedRect !== id) {
        const newConnection: ConnectionType = {
          from: selectedRect,
          to: id,
          style: currentLineStyle,
        };
        setConnections((prev) => [...prev, newConnection]);
        setSelectedRect(null);
      } else {
        setSelectedRect(null);
      }
    } else {
      setSelectedRect(prev => prev === id ? null : id);
    }
  };

  const handleScaleUp = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  };

  const handleScaleDown = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  return {
    rectangles,
    setRectangles,
    connections,
    setConnections,
    selectedRect,
    setSelectedRect,
    currentLineStyle,
    setCurrentLineStyle,
    isConnecting,
    setIsConnecting,
    connectionStart,
    setConnectionStart,
    isDragging,
    setIsDragging,
    isConnectingMode,
    handleStartConnecting,
    handleRectInteraction,
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
    handleScaleUp,
    handleScaleDown,
  };
};