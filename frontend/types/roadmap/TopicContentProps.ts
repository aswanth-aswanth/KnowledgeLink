export interface TopicContentProps {
    isDarkMode: boolean;
    isEditMode: boolean;
    isEditing: boolean;
    content: string;
    editedContent: string;
    onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleEditClick: () => void;
    handleSaveClick: () => void;
}