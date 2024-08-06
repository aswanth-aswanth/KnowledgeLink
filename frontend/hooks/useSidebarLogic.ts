import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { User, GroupChat, Chat, EncapsulatedMessage } from "@/types/chat";
import {
  createGroup,
  fetchGroupChats,
  getSearchUsers,
  startConversation,
} from "@/api/chat";
import apiClient from "@/api/apiClient";

export const useSidebarLogic = (
  socket: any,
  setUserChats: React.Dispatch<React.SetStateAction<Chat[]>>
) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [debouncedModalSearchTerm] = useDebounce(modalSearchTerm, 300);
  const [modalSearchResults, setModalSearchResults] = useState<User[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);

  const handleSearch = useCallback(async (term: string, forModal: boolean) => {
    if (term) {
      try {
        const data = await getSearchUsers(term);
        if (forModal) {
          setModalSearchResults(data);
        } else {
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      if (forModal) {
        setModalSearchResults([]);
      } else {
        setSearchResults([]);
      }
    }
  }, []);

  const handleStartConversation = useCallback(async (participantId: string) => {
    try {
      const response = await startConversation(participantId);
      console.log("Response : ", response);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  }, []);

  const handleCreateGroup = useCallback(async () => {
    try {
      const response = await createGroup(groupName, selectedParticipants);
      console.log("Group created:", response);
      setIsCreateGroupModalOpen(false);
      setGroupName("");
      setSelectedParticipants([]);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  }, [groupName, selectedParticipants]);

  const toggleParticipant = useCallback((userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const fetchGroupChat = useCallback(async () => {
    try {
      const response = await fetchGroupChats();
      console.log("response : group : ", response);
      setGroupChats(response);
    } catch (error) {
      console.error("Error fetching group chats:", error);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearchExpanded(false);
  }, []);

  useEffect(() => {
    if (socket) {
      const newMessageHandler = (encapsulatedMessage: EncapsulatedMessage) => {
        Object.keys(encapsulatedMessage).forEach((key) => {
          const message = encapsulatedMessage[key];
          console.log("newMessage received in Sidebar.tsx : ", message);
          setUserChats((prevChats) =>
            prevChats.map((chat) =>
              chat.chatId === message.chatId
                ? {
                  ...chat,
                  lastMessage: message.content,
                  updatedAt: message.createdAt,
                }
                : chat
            )
          );
        });
      };

      const deleteMessageHandler = ({
        chatId,
        messageId,
      }: {
        chatId: string;
        messageId: string;
      }) => {
        setUserChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.chatId === chatId) {
              if (chat.lastMessage === messageId) {
                fetchNewLastMessage(chatId).then((newLastMessage) => {
                  setUserChats((prevChats) =>
                    prevChats.map((c) =>
                      c.chatId === chatId
                        ? {
                          ...c,
                          lastMessage: newLastMessage.content,
                          updatedAt: newLastMessage.createdAt,
                        }
                        : c
                    )
                  );
                });
              }
            }
            return chat;
          })
        );
      };

      socket.on("new_message", newMessageHandler);
      socket.on("delete_message", deleteMessageHandler);

      return () => {
        socket.off("new_message", newMessageHandler);
        socket.off("delete_message", deleteMessageHandler);
      };
    }
  }, [socket, setUserChats]);

  const fetchNewLastMessage = async (chatId: string) => {
    try {
      const response = await apiClient.get(`/chat/${chatId}/messages?limit=1`);
      return response.data[0];
    } catch (error) {
      console.error("Error fetching new last message:", error);
      return { content: "No messages", createdAt: new Date().toISOString() };
    }
  };

  return {
    isSearchExpanded,
    setIsSearchExpanded,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    searchResults,
    isCreateGroupModalOpen,
    setIsCreateGroupModalOpen,
    groupName,
    setGroupName,
    selectedParticipants,
    setSelectedParticipants,
    modalSearchTerm,
    setModalSearchTerm,
    debouncedModalSearchTerm,
    modalSearchResults,
    groupChats,
    handleSearch,
    handleStartConversation,
    handleCreateGroup,
    toggleParticipant,
    fetchGroupChat,
    clearSearch
  };
};
