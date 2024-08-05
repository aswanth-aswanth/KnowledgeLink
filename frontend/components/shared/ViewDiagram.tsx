import React, { useState, useRef, useEffect } from "react";
import Rectangle from "../roadmap/Rectangle";
import Connection from "../roadmap/Connection";
import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import TopicModal from "../roadmap/TopicModal";

interface ViewDiagramProps {
  rectangles: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    uniqueId: string;
  }[];
  connections: {
    from: string;
    to: string;
    style: "straight" | "curved";
  }[];
  roadmapData: any;
}

const ViewDiagram: React.FC<ViewDiagramProps> = ({
  rectangles,
  connections,
  roadmapData,
}) => {
  const [scale, setScale] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const findTopicByUniqueId = (
    uniqueId: string,
    topics: any = roadmapData.topics
  ): any => {
    // Check if the current topic matches the uniqueId
    if (topics.uniqueId === uniqueId) {
      return topics;
    }

    // If the current topic has children, search through them
    if (topics.children && topics.children.length > 0) {
      for (const child of topics.children) {
        const result = findTopicByUniqueId(uniqueId, child);
        if (result) {
          return result;
        }
      }
    }

    // If no match is found, return null
    return null;
  };

  const handleScaleUp = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  };

  const handleScaleDown = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const handleRectangleClick = (rect: any) => {
    const topic = findTopicByUniqueId(rect.uniqueId);
    if (topic) {
      setSelectedTopic(topic);
    }
  };

  const maxX = Math.max(...rectangles.map((rect) => rect.x + rect.width));
  const maxY = Math.max(...rectangles.map((rect) => rect.y + rect.height));
  const svgWidth = Math.max(600, maxX + 100); // Add some padding
  const svgHeight = Math.max(600, maxY + 100); // Add some padding

  const aspectRatio = `${svgWidth}/${svgHeight}`;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && svgRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const svgAspectRatio = svgWidth / svgHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        if (containerAspectRatio > svgAspectRatio) {
          // Container is wider, fit to height
          svgRef.current.style.width = `${containerHeight * svgAspectRatio}px`;
          svgRef.current.style.height = `${containerHeight}px`;
        } else {
          // Container is taller, fit to width
          svgRef.current.style.width = `${containerWidth}px`;
          svgRef.current.style.height = `${containerWidth / svgAspectRatio}px`;
        }
      }
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, [svgWidth, svgHeight]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <div className="bg-gray-800 fixed bottom-4 right-4 z-50 text-white p-4 flex justify-center space-x-4">
        <button onClick={handleScaleUp} className="toolbar-button">
          <FaSearchPlus />
        </button>
        <button onClick={handleScaleDown} className="toolbar-button">
          <FaSearchMinus />
        </button>
      </div>
      <div
        className="w-full h-full mt-10 flex items-center justify-center"
        style={
          {
            "--aspect-ratio": aspectRatio,
          } as React.CSSProperties
        }
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "100%",
            height: "auto",
          }}
        >
          <g transform={`scale(${scale})`} transform-origin="center">
            {connections.map((conn, index) => (
              <Connection
                key={index}
                connection={conn}
                rectangles={rectangles}
                onDelete={() => {}}
                onChangeStyle={() => {}}
                circlesVisible={false}
              />
            ))}

            {rectangles.map((rect) => (
              <Rectangle
                key={rect.id}
                rect={rect}
                isSelected={false}
                onSelect={() => handleRectangleClick(rect)}
                onUpdatePosition={() => {}}
                onUpdateSize={() => {}}
                onDelete={() => {}}
                circlesVisible={false}
              />
            ))}
          </g>
        </svg>
      </div>
      {selectedTopic && (
        <TopicModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
        />
      )}
    </div>
  );
};

export default ViewDiagram;
