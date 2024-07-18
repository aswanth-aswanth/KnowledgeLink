import React, { useEffect, useState, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import apiClient from "@/api/apiClient";
import { Search, MessageCircleMore, X, Users } from "lucide-react";
import { Socket } from "socket.io-client";
import { Message } from "@/types";

interface User {
  _id: string;
  username: string;
  image: string;
}

interface Chat {
  userId: string;
  chatId: string;
  lastMessage: string;
  updatedAt: string;
  username: string;
  image: string;
}

interface GroupChat {
  chatId: string;
  name: string;
  lastMessage: string;
  updatedAt: string;
}

interface SidebarProps {
  isDarkMode: boolean;
  onChatSelect: (chatId: string) => void;
  socket: Socket | null;
  isVisible: boolean;
  onClose: () => void;
  userChats: Chat[];
  setUserChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export default function Sidebar({
  isDarkMode,
  onChatSelect,
  socket,
  isVisible,
  onClose,
  userChats,
  setUserChats,
}: SidebarProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [debouncedModalSearchTerm] = useDebounce(modalSearchTerm, 300);
  const [modalSearchResults, setModalSearchResults] = useState<User[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);

  const handleSearch = async (term: string, forModal: boolean) => {
    if (term) {
      try {
        const response = await apiClient(`/profile/search?name=${term}`);
        const { data } = await response;
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
  };

  const handleStartConversation = async (participantId: string) => {
    try {
      const response = await apiClient.post("/chat/individual", {
        participantId,
      });
      const { data } = await response;
      console.log("Response : ", data);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      console.log("handleCreateGroup name : ", groupName);
      const response = await apiClient.post("/chat/group", {
        name: groupName,
        participantIds: selectedParticipants,
      });
      const { data } = response;
      console.log("Group created:", data);
      setIsCreateGroupModalOpen(false);
      setGroupName("");
      setSelectedParticipants([]);
      // Optionally, update the userChats state to include the new group
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  const fetchGroupChats = async () => {
    try {
      const response = await apiClient.get("/chat/user/group-chats");
      console.log("response : group : ", response);
      setGroupChats(response.data);
    } catch (error) {
      console.error("Error fetching group chats:", error);
    }
  };

  useEffect(() => {
    fetchGroupChats();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("new_message", (message: Message) => {
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
    }

    return () => {
      if (socket) {
        socket.off("new_message");
      }
    };
  }, [socket, setUserChats]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    handleSearch(debouncedSearchTerm, false);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    handleSearch(debouncedModalSearchTerm, true);
  }, [debouncedModalSearchTerm]);

  return (
    <div
      className={`w-64 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      } border-r md:block overflow-y-auto fixed inset-y-0 left-0 z-20 transform ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } px-2 transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
    >
      <div className="mt-2" ref={searchRef}>
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold flex-grow">Chat Room</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
          {isSearchExpanded ? (
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchExpanded(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {searchResults.length > 0 ? (
        <div className="mb-6">
          <h3
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } mb-2`}
          >
            SEARCH RESULTS
          </h3>
          <ul className="space-y-2">
            {searchResults.map((user) => (
              <li
                key={user._id}
                className="flex items-center space-x-3 justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.image || "pngwing.com.png"}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.username}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStartConversation(user._id)}
                >
                  <MessageCircleMore className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <h3
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          } mb-2`}
        >
          YOUR CHATS
        </h3>
        <ul className="space-y-4">
          {userChats.map((chat) => (
            <li
              key={chat.chatId}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onChatSelect(chat.chatId)}
            >
              <img
                src={chat.image || "pngwing.com.png"}
                alt={chat.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col flex-grow">
                <div className="flex items-center justify-between">
                  <span>{chat.username}</span>
                  <span className="text-xs whitespace-nowrap">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-xs w-[170px] truncate">
                  {chat.lastMessage || "No messages yet"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3
          className={`text-sm font-medium mt-10 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          } mb-2`}
        >
          YOUR GROUP CHATS
        </h3>
        <ul className="space-y-4">
          {groupChats.map((chat) => (
            <li
              key={chat.chatId}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onChatSelect(chat.chatId)}
            >
              <Users className="w-8 h-8" />
              <div className="flex flex-col flex-grow">
                <div className="flex items-center justify-between">
                  <span>{chat.name}</span>
                  <span className="text-xs whitespace-nowrap">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-xs w-[170px] truncate">
                  {chat.lastMessage || "No messages yet"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 mb-4">
        <Button
          onClick={() => setIsCreateGroupModalOpen(true)}
          className={`w-full ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          variant="outline"
        >
          <Users className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </div>

      <Dialog
        open={isCreateGroupModalOpen}
        onOpenChange={setIsCreateGroupModalOpen}
      >
        <DialogContent
          className={`sm:max-w-[425px] ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          <DialogHeader>
            <DialogTitle className={isDarkMode ? "text-white" : "text-black"}>
              Create Group
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="group-name"
                className={`text-right ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Name
              </Label>
              <Input
                id="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className={`col-span-3 ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white"
                }`}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="participants"
                className={`text-right ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Participants
              </Label>
              <div className="col-span-3">
                <Input
                  id="participants"
                  placeholder="Search users..."
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  className={isDarkMode ? "bg-gray-700 text-white" : "bg-white"}
                />
                <div
                  className={`mt-2 max-h-40 overflow-y-auto ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {modalSearchResults.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="checkbox"
                        id={`user-${user._id}`}
                        checked={selectedParticipants.includes(user._id)}
                        onChange={() => toggleParticipant(user._id)}
                        className={isDarkMode ? "bg-gray-600" : "bg-white"}
                      />
                      <img
                        src={user.image || "pngwing.com.png"}
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <label htmlFor={`user-${user._id}`}>
                        {user.username}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleCreateGroup}
              className={
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              }
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
