import React from 'react';
import { Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TopicContentProps } from '@/types/roadmap';

const TopicContent: React.FC<TopicContentProps> = ({
  isEditMode,
  isEditing,
  content,
  editedContent,
  onContentChange,
  handleEditClick,
  handleSaveClick,
}) => (
  <div className="ml-2 sm:ml-6 mt-2">
    {isEditMode && (
      <Button
        onClick={isEditing ? handleSaveClick : handleEditClick}
        size="sm"
        className="mb-2"
      >
        {isEditing ? (
          <>
            <Save className="mr-2 h-4 w-4" /> Save Content
          </>
        ) : (
          <>
            <Edit className="mr-2 h-4 w-4" /> Edit Content
          </>
        )}
      </Button>
    )}
    {isEditing ? (
      <Textarea
        value={editedContent}
        onChange={onContentChange}
        className="min-h-32 sm:leading-8 p-2 mb-2 rounded-md transition-all duration-200 bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
      />
    ) : (
      <div
        className="h-min p-2 mb-2 sm:indent-4 rounded-xl transition-all duration-200 tracking-wider text-[0.9rem] leading-[1.8rem] bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-white"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )}
  </div>
);

export default TopicContent;
