import { useState } from 'react';

export function useRoadmapViewer(transformedTopics: any) {
  const [expandedTopics, setExpandedTopics] = useState<string[]>(() =>
    transformedTopics.topics.children.map((child: any) => [])
  );

  return {
    expandedTopics,
    setExpandedTopics,
  };
}
