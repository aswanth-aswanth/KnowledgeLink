// export interface Topic {
//   id: string;
//   name: string;
//   content: string; // Changed from 'any' to 'string' to fix type error
//   no: string;
//   children: string[];
//   isExpanded: boolean;
// }

// export interface TopicsState {
//   topics: Record<string, Topic>;
//   rootId: string;
//   editorData: any | null;
// }

export interface TopicNodeProps {
  id: string;
  index: number;
}
