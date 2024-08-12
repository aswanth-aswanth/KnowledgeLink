export interface TopicHeaderProps {
    topicName: string;
    level: string;
    isDarkMode: boolean;
    isExpanded: boolean;
    toggleExpand: () => void;
};