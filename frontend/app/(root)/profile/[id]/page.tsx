"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useDarkMode } from "@/hooks/useDarkMode";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import apiClient from "@/api/apiClient";
import { PostFeed } from "./PostFeed";

export default function Profile() {
  const { isDarkMode } = useDarkMode();
  const pathname = usePathname();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Profile");

  const getUser = async () => {
    try {
      const email = pathname.split("/")[2];
      const profile = await apiClient(`/profile/user/${email}`);
      console.log("user Profile : ", profile);
      setUser(profile.data);
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const followUser = async () => {
    try {
      const email = pathname.split("/")[2];
      const res = await apiClient.patch(`/profile/user/${email}/follow`);
      toast(res.data.message, {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      getUser();
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const getPosts = async () => {
    try {
      const email = pathname.split("/")[2];
      const userPosts = await apiClient(`/posts/user/${email}`);
      setPosts(userPosts.data);
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  useEffect(() => {
    getUser();
    if (selectedTab === "Posts") {
      getPosts();
    }
  }, [selectedTab]);

  return (
    <div
      className={`relative ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`h-52 ${isDarkMode ? "bg-gray-700" : "bg-gray-500"}`}
      ></div>
      <div
        className={`rounded-full absolute top-[90px] left-0 right-0 mx-auto w-56 h-56 ${
          isDarkMode ? "bg-gray-600" : "bg-gray-300"
        } p-4 overflow-hidden border-4 border-gray-600`}
      >
        {user?.image ? (
          <Image
            src={user.image}
            layout="fill"
            objectFit="cover"
            alt="Profile Picture"
          />
        ) : (
          <FaUserCircle className="w-full h-full text-gray-400" />
        )}
      </div>
      <div className="flex mt-36 items-center flex-col">
        <h3
          className={`font-bold text-lg ${
            isDarkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {user?.username}
        </h3>
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {user?.email}
        </p>
        <div className="flex items-center text-center">
          <div className="flex justify-center flex-col relative h-16 mt-8 px-4">
            <p className="font-bold">{user?.following?.length}</p>
            <p>Followers</p>
            <Separator
              orientation="vertical"
              className={`h-8 ${
                isDarkMode ? "bg-gray-400" : "bg-gray-500"
              } absolute right-0 top-4 w-[0.1rem]`}
            />
          </div>
          <div className="flex justify-center flex-col relative h-16 mt-8 px-4">
            <p className="font-bold">{user?.followers?.length}</p>
            <p>Followings</p>
            <Separator
              orientation="vertical"
              className={`h-8 ${
                isDarkMode ? "bg-gray-400" : "bg-gray-500"
              } absolute right-0 top-4 w-[0.1rem]`}
            />
          </div>
          <div className="h-16 flex items-center mt-8 px-4">
            <button
              onClick={() => {
                followUser();
              }}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              {user?.isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
      </div>
      <div
        className={`flex justify-center items-center gap-12 py-6 font-bold my-4 px-2 border ${
          isDarkMode
            ? "border-gray-600 text-gray-300"
            : "border-gray-200 text-gray-600"
        } border-x-0`}
      >
        <h3
          className="hover:text-blue-500 cursor-pointer transition-colors duration-300"
          onClick={() => setSelectedTab("Profile")}
        >
          Profile
        </h3>
        <h3
          className="hover:text-blue-500 cursor-pointer transition-colors duration-300"
          onClick={() => setSelectedTab("Posts")}
        >
          Posts
        </h3>
        <h3
          className="hover:text-blue-500 cursor-pointer transition-colors duration-300"
          onClick={() => setSelectedTab("Groups")}
        >
          Groups
        </h3>
      </div>
      {/* Conditional rendering based on selected tab */}
      {selectedTab === "Profile" && (
        <div>
          <h3 className="font-bold my-4 text-xl mt-14">About</h3>
          <p className="max-w-[880px] font-semibold tracking-wide leading-10">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
            nisi deleniti sunt dignissimos quam unde hic placeat veniam itaque
            incidunt nulla vero fugit culpa, praesentium inventore sequi
            sapiente quia sed. Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Itaque ut quia, iure, quis optio, voluptas ipsa
            magnam dicta beatae mollitia aperiam velit totam ipsam ullam
            assumenda eius? Aliquam, explicabo nemo.
          </p>
        </div>
      )}
      {selectedTab === "Posts" && (
        <div>
          <h3 className="font-bold my-4 text-xl mt-14">Posts</h3>
          <PostFeed posts={posts} />{" "}
          {/* Render PostFeed with the fetched posts */}
        </div>
      )}
      {selectedTab === "Groups" && <div>{/* Groups content */}</div>}
    </div>
  );
}
