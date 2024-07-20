"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { selectAuthState, checkTokenExpiration } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDarkMode } from "@/hooks/useDarkMode";
import apiClient from "@/api/apiClient";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDarkMode } = useDarkMode();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    dispatch(checkTokenExpiration());
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUsername(user.name || "");
      setBio(user.bio || "");
      setImagePreview(user.imageUrl || "");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-11/12 max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Login Required
          </h1>
          <p className="mb-6 text-center">
            Please log in to view and edit your profile.
          </p>
          <Button
            onClick={() => router.push("/sign-in")}
            className="w-full py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUserProfile = async (formData: FormData) => {
    try {
      const response = await apiClient.patch("/profile/user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("response update : ", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to update profile", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", username);
    formData.append("bio", bio);
    if (image) {
      formData.append("image", image);
    }

    try {
      const updatedUser = await updateUserProfile(formData);
      // Update the user state in Redux
      dispatch({ type: "auth/updateUser", payload: updatedUser });
      // Show success message
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile", error);
      // Show error message
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div
      className={`flex min-h-[91.9vh] items-center justify-center ${
        isDarkMode ? "bg-gray-800" : "bg-gray-200"
      } p-6`}
    >
      <Card className="w-full max-w-lg shadow-lg bg-white overflow-hidden rounded-lg">
        <CardHeader className="p-4 bg-gray-300">
          <CardTitle className="text-xl font-bold text-center text-gray-800">
            Edit Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 py-10 my-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <Avatar className="w-24 h-24 border-2 border-gray-300 shadow-md">
                <AvatarImage src={imagePreview || user?.imageUrl} />
                <AvatarFallback className="text-xl bg-gray-400 text-gray-700">
                  {username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Label htmlFor="profile-image" className="cursor-pointer mt-4">
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300">
                  Change Profile Picture
                </span>
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </Label>
            </div>

            <div>
              <Label
                htmlFor="username"
                className="text-md font-semibold text-gray-800"
              >
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 transition duration-300"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <Label
                htmlFor="bio"
                className="text-md font-semibold text-gray-800"
              >
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 transition duration-300"
                rows={4}
                placeholder="Tell us about yourself"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
