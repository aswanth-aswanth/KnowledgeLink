import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { CommentFormProps } from '@/types/posts';

export function CommentForm({ value, onChange, onSubmit }: CommentFormProps) {
  return (
    <div className="flex items-center space-x-2 mt-4">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      />
      <Button
        onClick={onSubmit}
        className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
