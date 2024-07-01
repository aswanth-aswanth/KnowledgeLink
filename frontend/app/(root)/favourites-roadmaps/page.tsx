"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CiSquarePlus } from "react-icons/ci";
import { Separator } from "@/components/ui/separator";
import RoadmapItems from "@/components/shared/RoadmapItems";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useRouter } from "next/navigation";
import apiClient from "@/api/apiClient";

export default function page() {
  const isDarkMode = useDarkMode();
  const router = useRouter();
  const [adminRoadmaps, setAdminRoadmaps] = useState([]);
  const [subscribedRoadmaps, setSubscribedRoadmaps] = useState([]);
  const cards = [
    {
      title: "Card Title 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      likes: 20,
    },
    {
      title: "Card Title 2",
      description:
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      likes: 15,
    },
    {
      title: "Card Title 3",
      description:
        "Nulla facilisi. Duis tincidunt libero in nulla elementum, sit amet suscipit dolor fermentum.",
      likes: 10,
    },
    {
      title: "Card Title 4",
      description:
        "Suspendisse potenti. Nam ut erat a leo varius ultricies nec sit amet eros.",
      likes: 18,
    },
    {
      title: "Card Title 5",
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
      likes: 25,
    },
    {
      title: "Card Title 6",
      description:
        "Maecenas vehicula dolor sed nulla maximus, sit amet gravida nunc cursus.",
      likes: 12,
    },
  ];

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

  useEffect(() => {
    getAdminRoadmaps();
    getUserSubscribedRoadmaps();
  }, []);

  return (
    <>
      <h1
        className={`font-bold text-center text-2xl pt-32 mb-6 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        User Created Roadmaps
      </h1>
      <div className="flex justify-center">
        {adminRoadmaps.map((roadmapItem: any) => {
          return (
            <div className="border rounded-md p-10 mx-auto max-w-[380px] flex flex-col  bg-white shadow-lg">
              <h3 className="mb-2 text-gray-800 font-semibold">
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
                <Button className="bg-blue-500 hover:bg-blue-600  text-xs text-white  px-4 rounded-md shadow-md">
                  Edit Roadmap
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600 text-xs text-white  px-4 rounded-md shadow-md">
                  Merge Contributions
                </Button>
              </div>
            </div>
          );
        })}
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
        User Subscribed Roadmaps
      </h1>
      <div className="grid grid-cols-12 mt-14 gap-4 md:px-4">
        {subscribedRoadmaps.map((card, index) => (
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
            />
          </div>
        ))}
      </div>
      <Separator className="my-10" />
      <h1
        className={`font-bold text-center text-2xl mt-20 pb-6 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Users favourites
      </h1>
    </>
  );
}
