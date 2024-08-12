import React from 'react';
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import Rectangle from '../roadmap/Rectangle';
import Connection from '../roadmap/Connection';
import TopicModal from '../roadmap/TopicModal';
import { ViewDiagramProps } from '@/types/roadmap';
import { useViewDiagram } from '@/hooks/useDiagram';

const ViewDiagram: React.FC<ViewDiagramProps> = ({
  rectangles,
  connections,
  roadmapData,
}) => {
  const {
    scale,
    selectedTopic,
    setSelectedTopic,
    containerRef,
    svgRef,
    handleScaleUp,
    handleScaleDown,
    handleRectangleClick,
    svgWidth,
    svgHeight,
    aspectRatio,
  } = useViewDiagram(rectangles, connections, roadmapData);

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
            '--aspect-ratio': aspectRatio,
          } as React.CSSProperties
        }
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: '100%',
            height: 'auto',
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
