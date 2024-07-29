import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import apiClient from "@/api/apiClient";

interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
  image?: string;
}

interface UserSearchProps {
  onAddMembers: (members: User[]) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onAddMembers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchUsers(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const searchUsers = async (term: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient(
        `/profile/search?name=${encodeURIComponent(term)}`
      );
      const {data} = response;
      console.log("response : ", data);
      setSearchResults(data);
    } catch (err) {
      setError("An error occurred while fetching users");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = (user: User) => {
    console.log("handleAddUser : ", user);
    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  console.log("Selected Users : ", selectedUsers);

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userId));
  };

  const handleConfirm = () => {
    onAddMembers(selectedUsers);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoading && (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      <ScrollArea className="h-[200px] w-full border rounded-md p-4">
        {searchResults.map((user) => (
          <div key={user.id} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Avatar>
                {user.image ? (
                  <>
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.username}</AvatarFallback>
                  </>
                ) : (
                  <FaUserCircle className="w-full h-full text-gray-400" />
                )}
              </Avatar>
              <div>
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddUser(user)}
            >
              Add
            </Button>
          </div>
        ))}
      </ScrollArea>
      <div>
        <h3 className="font-medium mb-2">Selected Users:</h3>
        <ScrollArea className="h-[100px] w-full border rounded-md p-4">
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between py-1"
            >
              <span>{user.username}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveUser(user._id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </ScrollArea>
      </div>
      <Button onClick={handleConfirm}>Confirm Selection</Button>
    </div>
  );
};

export default UserSearch;
