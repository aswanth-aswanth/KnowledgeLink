export interface TopicPropsRoadmapViewer {
    topic: {
        _id: string;
        uniqueId: string;
        name: string;
        content: string;
        children: TopicPropsRoadmapViewer["topic"][];
    };
    level: string;
    expandedTopics: string[];
    setExpandedTopics: React.Dispatch<React.SetStateAction<string[]>>;
    isEditMode: boolean;
    onContentChange: (uniqueId: string, newContent: string) => void;
    roadmapId: string;
}

export interface RoadmapViewerProps {
    transformedTopics: {
        _id: string;
        title: string;
        description: string;
        topics: TopicPropsRoadmapViewer["topic"];
    };
    isEditMode: boolean;
    onContentChange: (uniqueId: string, newContent: string) => void;
    roadmapId: string;
}