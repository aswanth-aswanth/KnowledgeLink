import { YooptaContentValue } from '@yoopta/editor';

export interface TopicContentProps {
  isEditMode: boolean;
  isEditing: boolean;
  content: YooptaContentValue;
  editedContent: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleEditClick: () => void;
  handleSaveClick: () => void;
}
