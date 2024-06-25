import React from "react";
import { Button } from "@/components/ui/button";
import { CiSquarePlus } from "react-icons/ci";
import { Separator } from "@/components/ui/separator";
import RoadmapItems from "@/components/shared/RoadmapItems";

export default function page() {
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
  return (
    <>
      <h1 className="font-bold text-center text-2xl mt-20 mb-6 text-gray-800">
        User Created Roadmaps
      </h1>
      <div className="border rounded-md p-10 mx-auto max-w-[380px] flex flex-col items-center bg-white shadow-lg">
        <h3 className="mb-6 text-gray-800 font-semibold">JavaScript</h3>
        <Button className="bg-blue-500 hover:bg-blue-600 text-xs text-white py-2 px-4 rounded-md shadow-md">
          Merge Contributions
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600 mt-2 text-xs text-white py-2 px-4 rounded-md shadow-md">
          Edit Roadmap
        </Button>
      </div>
      <div className="flex justify-center flex-col items-center mt-10">
        <CiSquarePlus className="text-5xl cursor-pointer text-gray-400" />
        <p className="text-base font-bold text-gray-600 mt-4">Create Roadmap</p>
      </div>
      <Separator className="my-10" />
      <h1 className="font-bold text-center text-2xl mt-20 mb-6 text-gray-800">
        User Subscribed Roadmaps
      </h1>
      <div className="grid grid-cols-12 mt-14 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex w-full
           col-span-6"
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
      <h1 className="font-bold text-center text-2xl mt-20 mb-6 text-gray-800">
        Users favourites 
      </h1>
    </>
  );
}
