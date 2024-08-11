"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CiSquarePlus } from "react-icons/ci";
import { Separator } from "@/components/ui/separator";
import RoadmapItems from "@/app/(root)/favourites-roadmaps/RoadmapItems";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useRouter } from "next/navigation";
import apiClient from "@/api/apiClient";

export default function page() {
  const { isDarkMode } = useDarkMode();
  const router = useRouter();
  const [adminRoadmaps, setAdminRoadmaps] = useState([]);
  const [subscribedRoadmaps, setSubscribedRoadmaps] = useState([]);
  const [userMemberedRoadmaps, setUserMemberedRoadmaps] = useState([]);

  const getAdminRoadmaps = async () => {
    try {
      const res = await apiClient("/roadmap/admin");
      console.log("Res : ", res.data);
      setAdminRoadmaps(res.data);
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const getUserSubscribedRoadmaps = async () => {
    try {
      const res = await apiClient("/roadmap/subscribed");
      console.log("Res : ", res.data);
      setSubscribedRoadmaps(res.data);
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const getUserMemberedRoadmaps = async () => {
    try {
      const res = await apiClient("/roadmap/member");
      console.log("Res user membered : ", res.data);
      setUserMemberedRoadmaps(res.data);
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const handleUnsubscribe = (roadmapId: string) => {
    setSubscribedRoadmaps((prev) =>
      prev.filter((roadmap) => roadmap._id !== roadmapId)
    );
  };

  useEffect(() => {
    getAdminRoadmaps();
    getUserSubscribedRoadmaps();
    getUserMemberedRoadmaps();
  }, []);

  return (
    <>
      <h1
        className={`font-bold text-center text-2xl pt-32 mb-6  ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Created Roadmaps
      </h1>
      <div className="flex gap-4 px-2 md:px-4 flex-wrap justify-center">
        {adminRoadmaps.length > 0 ? (
          adminRoadmaps.map((roadmapItem: any) => {
            return (
              <div className="border justify-center items-center rounded-md p-10 mx-auto max-w-[380px] flex flex-col  bg-white shadow-lg">
                <h3 className="mb-2 text-gray-800 text-center font-semibold">
                  Roadmap Name : {roadmapItem.title}
                </h3>
                <p>RoadmapType : {roadmapItem.type}</p>
                <p className="mb-6 mt-2">
                  RoadmapDescription : {roadmapItem.description}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={() =>
                      router.push(`/roadmap-viewer/${roadmapItem._id}`)
                    }
                    className="bg-lime-600 hover:bg-blue-600  text-xs text-white  px-4 rounded-md shadow-md"
                  >
                    View Roadmap
                  </Button>
                  {/* <Button className="bg-blue-500 hover:bg-blue-600  text-xs text-white  px-4 rounded-md shadow-md">
                    Edit Roadmap
                  </Button> */}
                  <Button
                    onClick={() =>
                      router.push(`/contributions/${roadmapItem._id}`)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-xs text-white  px-4 rounded-md shadow-md"
                  >
                    Merge Contributions
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <p
            className={`text-center ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            You haven't created any roadmaps yet.
          </p>
        )}
      </div>
      <div
        onClick={() => router.push("/create-roadmap")}
        className="flex justify-center flex-col items-center mt-10"
      >
        <CiSquarePlus className="text-5xl cursor-pointer text-gray-400" />
        <p
          className={`text-base font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          } mt-4`}
        >
          Create Roadmap
        </p>
      </div>
      <Separator className="my-10" />
      <h1
        className={`font-bold text-center text-2xl mt-20 mb-6 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Subscribed Roadmaps
      </h1>
      <div className="grid grid-cols-12 mt-14 gap-4 md:px-4">
        {subscribedRoadmaps.length > 0 ? (
          subscribedRoadmaps.map((card: any, index) => (
            <div
              key={index}
              className="flex w-full
            col-span-12
           md:col-span-6"
            >
              <RoadmapItems
                title={card.title}
                description={card.description}
                likes={card.likes}
                id={card._id}
                onUnsubscribe={handleUnsubscribe}
              />
            </div>
          ))
        ) : (
          <p
            className={`col-span-12 text-center ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            You haven't subscribed to any roadmaps yet.
          </p>
        )}
      </div>
      <Separator className="my-10" />
      <h1
        className={`font-bold text-center text-2xl mt-20 pb-6 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Favourites
      </h1>
      <p
        className={`text-center pb-10 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Your favorite roadmaps will appear here.
      </p>
      <Separator className="my-10" />
      <h1
        className={`font-bold text-center text-2xl mt-20 pb-6 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Membered roadmaps
      </h1>
      <div className="flex gap-4 px-2 md:px-4 flex-wrap justify-center">
        {userMemberedRoadmaps.length > 0 ? (
          userMemberedRoadmaps.map((roadmapItem: any) => {
            return (
              <div className="border justify-center items-center rounded-md gap-4 px-2 md:px-4 flex-wrap  p-10 mx-auto max-w-[380px] flex flex-col  bg-white shadow-lg">
                <h3 className="mb-2 text-gray-800 text-center font-semibold">
                  Roadmap Name : {roadmapItem.title}
                </h3>
                <p>RoadmapType : {roadmapItem.type}</p>
                <p className="mb-6 mt-2">
                  RoadmapDescription : {roadmapItem.description}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={() =>
                      router.push(`/roadmap-viewer/${roadmapItem._id}`)
                    }
                    className="bg-lime-600 hover:bg-blue-600  text-xs text-white  px-4 rounded-md shadow-md"
                  >
                    View Roadmap
                  </Button>
                  <Button
                    onClick={() =>
                      router.push(`/contribute-roadmap/${roadmapItem._id}`)
                    }
                    className="bg-blue-500 hover:bg-blue-600  text-xs text-white  px-4 rounded-md shadow-md"
                  >
                    Contribute
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <p
            className={`text-center ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            You've not been a member of any roadmap yet.
          </p>
        )}
      </div>
    </>
  );
}
