import { useState } from "react";
import { useDarkMode } from "@/hooks/useDarkMode";

export function useRoadmapViewer(transformedTopics: any) {
    const { isDarkMode } = useDarkMode();
    const [expandedTopics, setExpandedTopics] = useState<string[]>(() =>
        transformedTopics.topics.children.map((child: any) => [])
    );

    return {
        isDarkMode,
        expandedTopics,
        setExpandedTopics,
    };
}