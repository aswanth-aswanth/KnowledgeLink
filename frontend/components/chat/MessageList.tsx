import React from "react";
import { MessageListProps } from "@/types/chatwindow";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { BiCheckDouble } from "react-icons/bi";

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  hoveredMessageId,
  setHoveredMessageId,
  handleDeleteMessage,
  formatTime,
  isDarkMode,
  chatContainerRef,
  messagesEndRef,
  handleScroll,
}) => {
  return (
    <div
      ref={chatContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900 scrollbar-hide"
    >
      {messages.length > 0 ? (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
            onMouseEnter={() => setHoveredMessageId(message.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            <div
              className={`max-w-xs sm:mr-2 lg:max-w-md px-4 py-2 rounded-[6px] relative ${
                message.senderId === currentUserId
                  ? "bg-green-500 text-white dark:bg-[#005c4b] dark:text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-white"
              }`}
            >
              <p>{message.content}</p>
              <div className="flex items-center justify-between ">
                <p
                  className={`text-[0.6rem] flex items-center gap-1 mt-1 ${
                    message.senderId === currentUserId
                      ? "text-white dark:text-gray-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {formatTime(message.createdAt)}
                  {message.readBy.length > 0 &&
                    message.senderId === currentUserId && (
                      <BiCheckDouble className="text-sm dark:text-blue-400" />
                    )}
                </p>
              </div>
              {hoveredMessageId === message.id &&
                message.senderId === currentUserId && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute -right-8 top-0 ${
                          isDarkMode ? "text-red-400" : "text-red-500"
                        }`}
                      >
                        <Trash2
                          className={`h-4 w-4 ${
                            isDarkMode ? "text-red-400" : "text-red-500"
                          }`}
                        />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                      className={`${
                        isDarkMode ? "bg-gray-700 text-white" : "bg-white"
                      }`}
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle
                          className={`${isDarkMode ? "text-white" : ""}`}
                        >
                          Are you sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription
                          className={`${isDarkMode ? "text-gray-300" : ""}`}
                        >
                          This action cannot be undone. This will permanently
                          delete the message.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          className={`${
                            isDarkMode
                              ? "bg-gray-700 text-white hover:bg-gray-600"
                              : ""
                          }`}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteMessage(message.id)}
                          className={`${
                            isDarkMode
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : ""
                          }`}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
            </div>
          </div>
        ))
      ) : (
        <p className="dark:text-white">No messages yet.</p>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
