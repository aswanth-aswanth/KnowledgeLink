import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateGroupModalProps } from "@/types/chat";

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onOpenChange,
  isDarkMode,
  groupName,
  setGroupName,
  modalSearchTerm,
  setModalSearchTerm,
  modalSearchResults,
  selectedParticipants,
  toggleParticipant,
  handleCreateGroup,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                      src={user.image || "/pngwing.com.png"}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <label htmlFor={`user-${user._id}`}>{user.username}</label>
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
  );
};
