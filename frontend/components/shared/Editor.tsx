"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Rectangle from "./Rectangle";
import Toolbar from "./Toolbar";
import Connection from "./Connection";

interface Topic {
  name: string;
  content: string;
  children: Topic[];
}

interface Rect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
}

interface ConnectionType {
  from: string;
  to: string;
  style: "straight" | "curved";
}

const Editor: React.FC = () => {
  const [rectangles, setRectangles] = useState<Rect[]>([]);
  const [connections, setConnections] = useState<ConnectionType[]>([]);
  const [selectedRect, setSelectedRect] = useState<string | null>(null);
  const [currentLineStyle, setCurrentLineStyle] = useState<
    "straight" | "curved"
  >("straight");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [lineStyle, setLineStyle] = useState<"straight" | "curved">("straight");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [svgHeight, setSvgHeight] = useState(600);
  const [selectedRects, setSelectedRects] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [circlesVisible, setCirclesVisible] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const topicsData: Topic = {
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
            children: [
              {
                name: "String",
                content: "Explanation and examples of strings",
                children: [],
              },
              {
                name: "Number",
                content: "Explanation and examples of numbers",
                children: [],
              },
              {
                name: "Boolean",
                content: "Explanation and examples of booleans",
                children: [],
              },
              {
                name: "Undefined",
                content: "Explanation and examples of undefined",
                children: [],
              },
              {
                name: "Null",
                content: "Explanation and examples of null",
                children: [],
              },
              {
                name: "Symbol",
                content: "Explanation and examples of symbols",
                children: [],
              },
              {
                name: "BigInt",
                content: "Explanation and examples of BigInt",
                children: [],
              },
            ],
          },
          {
            name: "Reference Types",
            content: "Detailed explanation of reference types",
            children: [
              {
                name: "Objects",
                content: "Explanation and examples of objects",
                children: [],
              },
              {
                name: "Arrays",
                content: "Explanation and examples of arrays",
                children: [],
              },
              {
                name: "Functions",
                content:
                  "Explanation and examples of functions as reference types",
                children: [],
              },
            ],
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
          {
            name: "Arrow Functions",
            content: "Understanding arrow functions",
            children: [],
          },
          {
            name: "Anonymous Functions",
            content: "Understanding anonymous functions",
            children: [],
          },
          {
            name: "Callbacks",
            content: "Understanding callbacks",
            children: [],
          },
          {
            name: "Higher-Order Functions",
            content: "Understanding higher-order functions",
            children: [],
          },
          {
            name: "Closures",
            content: "Understanding closures",
            children: [],
          },
        ],
      },
      {
        name: "Control Flow",
        content: "Understanding control flow in JavaScript",
        children: [
          {
            name: "Conditional Statements",
            content:
              "Explanation and examples of if, else, and switch statements",
            children: [],
          },
          {
            name: "Loops",
            content:
              "Explanation and examples of for, while, and do-while loops",
            children: [],
          },
          {
            name: "Break and Continue",
            content:
              "Explanation and examples of break and continue statements",
            children: [],
          },
        ],
      },
      {
        name: "Objects and Prototypes",
        content: "Understanding objects and prototypes in JavaScript",
        children: [
          {
            name: "Object Creation",
            content: "Different ways to create objects",
            children: [],
          },
          {
            name: "Prototypes",
            content: "Explanation of prototypes and prototype chain",
            children: [],
          },
          {
            name: "Inheritance",
            content: "Understanding inheritance in JavaScript",
            children: [],
          },
          {
            name: "Classes",
            content: "Introduction to ES6 classes",
            children: [],
          },
        ],
      },
      {
        name: "Asynchronous JavaScript",
        content: "Understanding asynchronous programming in JavaScript",
        children: [
          {
            name: "Callbacks",
            content: "Explanation and examples of callbacks",
            children: [],
          },
          {
            name: "Promises",
            content: "Explanation and examples of promises",
            children: [],
          },
          {
            name: "Async/Await",
            content: "Explanation and examples of async/await",
            children: [],
          },
          {
            name: "Event Loop",
            content: "Understanding the event loop",
            children: [],
          },
        ],
      },
      {
        name: "DOM Manipulation",
        content: "Understanding how to manipulate the DOM",
        children: [
          {
            name: "Selecting Elements",
            content: "Different methods to select DOM elements",
            children: [],
          },
          {
            name: "Modifying Elements",
            content: "How to modify DOM elements",
            children: [],
          },
          {
            name: "Event Handling",
            content: "How to handle events in the DOM",
            children: [],
          },
        ],
      },
      {
        name: "ES6+ Features",
        content: "Introduction to modern JavaScript features",
        children: [
          {
            name: "Let and Const",
            content: "Understanding let and const",
            children: [],
          },
          {
            name: "Template Literals",
            content: "Understanding template literals",
            children: [],
          },
          {
            name: "Destructuring",
            content: "Understanding destructuring assignments",
            children: [],
          },
          {
            name: "Modules",
            content: "Understanding JavaScript modules",
            children: [],
          },
          {
            name: "Spread and Rest",
            content: "Understanding spread and rest operators",
            children: [],
          },
          {
            name: "Default Parameters",
            content: "Understanding default function parameters",
            children: [],
          },
          {
            name: "Classes",
            content: "Understanding ES6 classes",
            children: [],
          },
          {
            name: "Promises",
            content: "Understanding promises",
            children: [],
          },
          {
            name: "Async/Await",
            content: "Understanding async/await",
            children: [],
          },
        ],
      },
      {
        name: "Advanced Topics",
        content: "Diving deeper into JavaScript",
        children: [
          {
            name: "Currying",
            content: "Understanding currying",
            children: [],
          },
          {
            name: "Memoization",
            content: "Understanding memoization",
            children: [],
          },
          {
            name: "Event Delegation",
            content: "Understanding event delegation",
            children: [],
          },
          {
            name: "Modules and Bundling",
            content: "Understanding modules and how to bundle them",
            children: [],
          },
          {
            name: "Web Workers",
            content: "Understanding web workers",
            children: [],
          },
          {
            name: "Service Workers",
            content: "Understanding service workers",
            children: [],
          },
        ],
      },
    ],
  };

  const toggleCircleVisibility = () => {
    setCirclesVisible((prev) => !prev);
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

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 0) {
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (svgRect) {
        setDragStart({
          x: e.clientX - svgRect.left,
          y: e.clientY - svgRect.top,
        });
      }
      setIsDragging(true);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (isDragging && (selectedRect || selectedRects.length > 0)) {
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          const dx = e.clientX - svgRect.left - dragStart.x;
          const dy = e.clientY - svgRect.top - dragStart.y;

          setRectangles((prevRects) =>
            prevRects.map((rect) => {
              if (
                (isMultiSelectMode && selectedRects.includes(rect.id)) ||
                (!isMultiSelectMode && rect.id === selectedRect)
              ) {
                return { ...rect, x: rect.x + dx, y: rect.y + dy };
              }
              return rect;
            })
          );

          setDragStart({
            x: e.clientX - svgRect.left,
            y: e.clientY - svgRect.top,
          });
        }
      }
    },
    [isDragging, selectedRect, selectedRects, isMultiSelectMode, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        setSelectedRects(rectangles.map((rect) => rect.id));
      }
    },
    [rectangles]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
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
    }
  };

  const handleSelectLineStyle = (style: "straight" | "curved") => {
    setCurrentLineStyle(style);
  };

  const handleChangeConnectionStyle = (
    index: number,
    style: "straight" | "curved"
  ) => {
    setConnections(
      connections.map((conn, i) => (i === index ? { ...conn, style } : conn))
    );
  };

  const createRectanglesFromData = useCallback(
    (topic: Topic, level: number = 0, yOffset: number = 0) => {
      const newRects: Rect[] = [];
      const rectWidth = 200;
      const rectHeight = 50;
      const xOffset = level * 250;

      const rect: Rect = {
        id: `rect-${level}-${yOffset}`,
        x: xOffset,
        y: yOffset,
        width: rectWidth,
        height: rectHeight,
        name: topic.name,
      };
      newRects.push(rect);

      let currentYOffset = yOffset + rectHeight + 20;
      topic.children.forEach((child, index) => {
        const childRects = createRectanglesFromData(
          child,
          level + 1,
          currentYOffset
        );
        newRects.push(...childRects);
        currentYOffset += childRects.length * (rectHeight + 20);
      });

      return newRects;
    },
    []
  );

  useEffect(() => {
    const initialRectangles = createRectanglesFromData(topicsData);
    setRectangles(initialRectangles);
    updateSvgHeight();
  }, [createRectanglesFromData]);

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

  const handleCreateRect = () => {
    const newRect: Rect = {
      id: `rect${rectangles.length + 1}`,
      name: "newContent",
      x: 100,
      y: 100,
      width: 100,
      height: 50,
    };
    setRectangles([...rectangles, newRect]);
    updateSvgHeight();
  };

  const handleDeleteRect = (id: string) => {
    setRectangles((rects) => rects.filter((rect) => rect.id !== id));
    setConnections((conns) =>
      conns.filter((conn) => conn.from !== id && conn.to !== id)
    );
    if (selectedRect === id) {
      setSelectedRect(null);
    }
  };

  const handleStartConnecting = () => {
    setIsConnecting(true);
  };

  const handleRectClick = (id: string) => {
    if (isConnecting) {
      if (!connectionStart) {
        setConnectionStart(id);
      } else {
        setSelectedRect(id);
        handleCreateConnection();
      }
    } else {
      setSelectedRect(id);
    }
  };

  useEffect(() => {
    updateSvgHeight();
  }, [rectangles, updateSvgHeight]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div>
      <Toolbar
        onAddRectangle={handleCreateRect}
        onStartConnecting={handleStartConnecting}
        isConnecting={isConnecting}
        onCreateConnection={handleCreateConnection}
        onSelectLineStyle={handleSelectLineStyle}
        selectedLineStyle={currentLineStyle}
        isMultiSelectMode={isMultiSelectMode}
        onToggleMultiSelect={() => setIsMultiSelectMode((prev) => !prev)}
        circlesVisible={circlesVisible}
        onToggleCircleVisibility={toggleCircleVisibility}
      />
      <svg
        ref={svgRef}
        width="100%"
        height={svgHeight}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
      >
        {connections.map((conn, index) => (
          <Connection
            key={index}
            connection={conn}
            rectangles={rectangles}
            onDelete={() => {
              setConnections(connections.filter((_, i) => i !== index));
            }}
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
            onSelect={(e) => handleRectClick(rect.id)}
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
    </div>
  );
};

export default Editor;
