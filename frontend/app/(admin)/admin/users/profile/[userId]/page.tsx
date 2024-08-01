"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDarkMode } from "@/hooks/useDarkMode";
import apiClient from "@/api/apiClient";
import { useParams } from "next/navigation";

export default function AdminUserProfile() {
  const dispatch = useDispatch();
  const { isDarkMode } = useDarkMode();
  const params = useParams();
  console.log("params : ", params);

  const userId: string = params.userId;

  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch, userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await apiClient(`/profile/user/${userId}`);
      console.log("fetchUser details : ", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  /* if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-11/12 max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Admin Access Required
          </h1>
          <p className="mb-6 text-center">
            Please log in as an admin to view user profiles.
          </p>
        </Card>
      </div>
    );
  } */

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-11/12 max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">
            User Not Found
          </h1>
          <p className="mb-6 text-center">
            The requested user profile could not be found.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[91.9vh] items-center justify-center  dark:bg-gray-800 p-6">
      <Card className="w-full max-w-lg shadow-lg bg-white dark:bg-gray-800 overflow-hidden rounded-lg">
        <CardHeader className="p-4 bg-gray-300">
          <CardTitle className="text-xl font-bold text-center text-gray-800">
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 py-10 my-3 ">
          <div className="flex flex-col  items-center mb-6">
            <Avatar className="w-24 h-24  border-2 border-gray-300 shadow-md">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="text-xl bg-gray-400 text-gray-700">
                {user?.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-2xl dark:text-white font-bold text-gray-800">
              {user?.username}
            </h2>
            <p className="text-gray-600 dark:text-white">{user?.email}</p>
          </div>

          <div className="space-y-4 dark:text-white">
            <div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                Username
              </h3>
              <p className="mt-1 text-gray-600 dark:text-white">
                {user?.username}
              </p>
            </div>

            <div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                Bio
              </h3>
              <p className="mt-1 text-gray-600 dark:text-white">
                {user?.bio || "No bio provided"}
              </p>
            </div>

            <div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                Joined On
              </h3>
              <p className="mt-1 text-gray-600 dark:text-white">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
