import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CommentListProps } from '@/types/posts/Comment';

export function CommentList({
  comments,
  onReply,
  onAddReply,
  onToggleReplies,
  showReplies,
}: CommentListProps) {
  return (
    <>
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-md"
        >
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <img
                src={`https://ui-avatars.com/api/?name=${comment.author}&background=random`}
                alt={comment.author}
                className="rounded-full"
              />
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {comment.author}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
              <p className="mt-1 text-gray-800 dark:text-gray-200 break-words">
                {comment.text}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply(comment._id)}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Reply
                </Button>
                {comment.replyCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleReplies(comment._id)}
                    className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                  >
                    {showReplies[comment._id] ? (
                      <ChevronUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 mr-1" />
                    )}
                    {comment.replyCount}{' '}
                    {comment.replyCount === 1 ? 'Reply' : 'Replies'}
                  </Button>
                )}
              </div>
              {showReplies[comment._id] && comment.replies && (
                <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="mt-2">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {reply.author}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(reply.createdAt).toLocaleString()}
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {reply.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
