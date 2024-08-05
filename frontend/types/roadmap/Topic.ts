export interface Topic {
  uniqueId: string;
  name: string;
  content: string;
  children: Topic[];
}

export interface TopicProps {
  topic: Topic;
  level: string;
  expandedTopics: string[];
  setExpandedTopics: React.Dispatch<React.SetStateAction<string[]>>;
  isEditMode: boolean;
  onContentChange: (uniqueId: string, newContent: string) => void;
}  