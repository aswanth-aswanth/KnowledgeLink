import { useState, useEffect } from "react";
import { useDarkMode } from "@/hooks/useDarkMode";

export function useTopic(topic: any, expandedTopics: string[], onContentChange: (uniqueId: string, content: string) => void) {
    const { isDarkMode } = useDarkMode();
    const isExpanded = expandedTopics.includes(topic.uniqueId);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(topic.content);

    useEffect(() => {
        setEditedContent(topic.content);
    }, [topic.content]);

    const toggleExpand = (setExpandedTopics: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (isExpanded) {
            setExpandedTopics(expandedTopics.filter((id) => id !== topic.uniqueId));
        } else {
            setExpandedTopics([...expandedTopics, topic.uniqueId]);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        onContentChange(topic.uniqueId, editedContent);
        setIsEditing(false);
    };

    return {
        isDarkMode,
        isExpanded,
        isEditing,
        editedContent,
        setEditedContent,
        toggleExpand,
        handleEditClick,
        handleSaveClick,
    };
}