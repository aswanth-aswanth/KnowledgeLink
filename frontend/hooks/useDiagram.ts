import { useState, useRef, useEffect } from "react";

export function useViewDiagram(rectangles: any[], connections: any[], roadmapData: any) {
    const [scale, setScale] = useState(1);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const findTopicByUniqueId = (uniqueId: string, topics: any = roadmapData.topics): any => {
        if (topics.uniqueId === uniqueId) {
            return topics;
        }

        if (topics.children && topics.children.length > 0) {
            for (const child of topics.children) {
                const result = findTopicByUniqueId(uniqueId, child);
                if (result) {
                    return result;
                }
            }
        }

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
    const svgWidth = Math.max(600, maxX + 100);
    const svgHeight = Math.max(600, maxY + 100);
    const aspectRatio = `${svgWidth}/${svgHeight}`;

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current && svgRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const containerHeight = containerRef.current.clientHeight;
                const svgAspectRatio = svgWidth / svgHeight;
                const containerAspectRatio = containerWidth / containerHeight;

                if (containerAspectRatio > svgAspectRatio) {
                    svgRef.current.style.width = `${containerHeight * svgAspectRatio}px`;
                    svgRef.current.style.height = `${containerHeight}px`;
                } else {
                    svgRef.current.style.width = `${containerWidth}px`;
                    svgRef.current.style.height = `${containerWidth / svgAspectRatio}px`;
                }
            }
        };

        window.addEventListener("resize", updateSize);
        updateSize();

        return () => window.removeEventListener("resize", updateSize);
    }, [svgWidth, svgHeight]);

    return {
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
    };
}