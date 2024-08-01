import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import apiClient from "@/api/apiClient";

interface FormData {
  title: string;
  description: string;
  scheduledTime: string;
  invitedUsers: string[];
}

interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
  image?: string;
}

interface CreateMeetingFormProps {
  onMeetingCreated: () => Promise<void>;
}

export function CreateMeetingForm({
  onMeetingCreated,
}: CreateMeetingFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    scheduledTime: "",
    invitedUsers: [],
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchUsers = async (term: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient(
        `/profile/search?name=${encodeURIComponent(term)}`
      );
      const { data } = response;
      setSearchResults(data);
    } catch (err) {
      setError("An error occurred while fetching users");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.scheduledTime)
      newErrors.scheduledTime = "Scheduled time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const meetingId = uuidv4();
      const meetingData = {
        ...formData,
        meetingId,
        roomName: meetingId,
      };

      try {
        const response = await apiClient.post(
          "/notification/meeting",
          meetingData
        );
        console.log("Meeting created:", response.data);
        setOpen(false);
        setFormData({
          title: "",
          description: "",
          scheduledTime: "",
          invitedUsers: [],
        });
        await onMeetingCreated(); // Call the prop function after successful creation
      } catch (error) {
        console.error("Error creating meeting:", error);
        // You might want to add some error handling here
      }
    }
  };

  const inviteUser = (user: User) => {
    if (!formData.invitedUsers.includes(user.email)) {
      setFormData((prev) => ({
        ...prev,
        invitedUsers: [...prev.invitedUsers, user.email],
      }));
    }
    setSearchQuery("");
  };

  const removeInvitedUser = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      invitedUsers: prev.invitedUsers.filter(
        (invitedEmail) => invitedEmail !== email
      ),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 text-white dark:hover:bg-blue-600">
          Create Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[600px] bg-white dark:bg-gray-800 p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100">
            Create New Meeting
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label
              htmlFor="title"
              className="text-sm sm:text-base text-gray-700 dark:text-gray-300"
            >
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Meeting title"
              className="mt-1 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.title && (
              <p className="text-xs sm:text-sm text-red-500 dark:text-red-400 mt-1">
                {errors.title}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="description"
              className="text-sm sm:text-base text-gray-700 dark:text-gray-300"
            >
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Meeting description"
              className="mt-1 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <Label
              htmlFor="scheduledTime"
              className="text-sm sm:text-base text-gray-700 dark:text-gray-300"
            >
              Scheduled Time
            </Label>
            <Input
              id="scheduledTime"
              name="scheduledTime"
              type="datetime-local"
              value={formData.scheduledTime}
              onChange={handleInputChange}
              className="mt-1 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.scheduledTime && (
              <p className="text-xs sm:text-sm text-red-500 dark:text-red-400 mt-1">
                {errors.scheduledTime}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="userSearch"
              className="text-sm sm:text-base text-gray-700 dark:text-gray-300"
            >
              Invite Users
            </Label>
            <Input
              id="userSearch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users to invite"
              className="mt-1 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {isLoading && (
              <div className="flex justify-center mt-2">
                <Loader2 className="animate-spin w-6 h-6" />
              </div>
            )}
            {error && (
              <div className="text-xs sm:text-sm text-red-500 mt-2">
                {error}
              </div>
            )}
            {searchResults.length > 0 && (
              <ScrollArea className="h-[200px] mt-2 border border-gray-200 dark:border-gray-600 rounded-md">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                        {user.image ? (
                          <>
                            <AvatarImage src={user.image} />
                            <AvatarFallback>
                              {user.username.charAt(0)}
                            </AvatarFallback>
                          </>
                        ) : (
                          <FaUserCircle className="w-full h-full text-gray-400" />
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
                          {user.username}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => inviteUser(user)}
                    >
                      Invite
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            )}
          </div>

          {formData.invitedUsers.length > 0 && (
            <div>
              <Label className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Invited Users
              </Label>
              <ScrollArea className="h-[100px] mt-2 border border-gray-200 dark:border-gray-600 rounded-md">
                {formData.invitedUsers.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                      {email}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeInvitedUser(email)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}

          <Button
            type="submit"
            className="w-full sm:w-auto mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          >
            Schedule Meeting
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
