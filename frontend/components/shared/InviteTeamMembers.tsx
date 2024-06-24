"use client";
import React, { useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const InviteTeamMembers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userList, setUserList] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
    { id: 4, name: "Bob Brown" },
    // Add more users as needed
  ]);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleUserSelect = useCallback(
    (user) => {
      setSelectedUsers([...selectedUsers, user]);
    },
    [selectedUsers]
  );

  const handleRemoveUser = useCallback(
    (userId) => {
      setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
    },
    [selectedUsers]
  );

  const handleSubmit = useCallback(() => {
    // Handle submit logic here
    console.log("Selected Users:", selectedUsers);
    // Reset state or perform other actions
  }, [selectedUsers]);

  const filteredUsers = userList.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <AlertDialog>
      <div className="flex justify-center mt-8">
        <AlertDialogTrigger>
          <Button variant="outline">Submit</Button>
        </AlertDialogTrigger>
      </div>
      <AlertDialogContent className="bg-white mx-auto flex flex-col max-w-4xl  justify-center p-0 pb-4 w-max">
        <div className="w-[98vw]  sm:w-[60vw]  mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              Invite Team Members
            </h2>
          </div>
          <div className="p-6">
            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300"
              />
              <svg
                className="absolute right-3 top-3 h-6 w-6 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            {/* User List */}
            {filteredUsers.length > 0 && (
              <ul className="mb-6 max-h-60 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  >
                    <button
                      onClick={() => handleUserSelect(user)}
                      className="text-gray-700 hover:text-gray-900 focus:outline-none flex items-center w-full"
                    >
                      <span className="flex-grow text-left">{user.name}</span>
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-gray-700">
                  Selected Users:
                </h3>
                <ul className="space-y-2">
                  {selectedUsers.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center justify-between bg-gray-100 py-2 px-3 rounded-md"
                    >
                      <span className="text-gray-800">{user.name}</span>
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-md transition-all duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Invite Members
            </button>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InviteTeamMembers;
