import React from 'react';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PostHeaderProps } from '@/types/posts';

export function PostHeader({ post, onSave }: PostHeaderProps) {
  return (
    <div className="flex items-center mb-4">
      <img
        src={`https://ui-avatars.com/api/?name=${post.creatorId}&background=random`}
        alt={post.creatorId}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 border-2 border-blue-500 dark:border-blue-400"
      />
      <div>
        <h3 className="font-bold text-lg sm:text-xl dark:text-white">
          {post.creatorId}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="ml-auto dark:text-white">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        >
          <DropdownMenuItem
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
          >
            Save Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
