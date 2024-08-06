import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, MessageCircleMore, X, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SidebarProps } from "@/types/chat";
import { useSidebarLogic } from "@/hooks/useSidebarLogic";
import { CreateGroupModal } from "@/components/chat/CreateGroupModal";
import { SearchResults } from "@/components/chat/SearchResults";
import { GroupChatList } from "@/components/chat/GroupChatList";
import { UserChatList } from "@/components/chat/UserChatlist";

export default function Sidebar({
  isDarkMode,
  onChatSelect,
  socket,
  isVisible,
  onClose,
  userChats,
  setUserChats,
}: SidebarProps) {
  const {
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
  } = useSidebarLogic(socket, setUserChats);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGroupChat();
  }, [fetchGroupChat]);

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
  }, [setIsSearchExpanded]);

  useEffect(() => {
    handleSearch(debouncedSearchTerm, false);
  }, [debouncedSearchTerm, handleSearch]);

  useEffect(() => {
    handleSearch(debouncedModalSearchTerm, true);
  }, [debouncedModalSearchTerm, handleSearch]);

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

      <SearchResults
        searchResults={searchResults}
        isDarkMode={isDarkMode}
        handleStartConversation={handleStartConversation}
      />

      <UserChatList
        userChats={userChats}
        isDarkMode={isDarkMode}
        onChatSelect={onChatSelect}
      />

      <GroupChatList
        groupChats={groupChats}
        isDarkMode={isDarkMode}
        onChatSelect={onChatSelect}
      />

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

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onOpenChange={setIsCreateGroupModalOpen}
        isDarkMode={isDarkMode}
        groupName={groupName}
        setGroupName={setGroupName}
        modalSearchTerm={modalSearchTerm}
        setModalSearchTerm={setModalSearchTerm}
        modalSearchResults={modalSearchResults}
        selectedParticipants={selectedParticipants}
        toggleParticipant={toggleParticipant}
        handleCreateGroup={handleCreateGroup}
      />
    </div>
  );
}
