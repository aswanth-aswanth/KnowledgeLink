import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import apiClient from "@/api/apiClient";

const contributors = [
  { name: "John Doe", designation: "Software Engineer" },
  { name: "Jane Smith", designation: "Product Manager" },
  { name: "Alice Johnson", designation: "UI/UX Designer" },
  { name: "Bob Brown", designation: "Data Scientist" },
  { name: "Charlie Green", designation: "DevOps Engineer" },
  { name: "Diana White", designation: "Frontend Developer" },
  { name: "Eve Black", designation: "Backend Developer" },
  { name: "Frank Blue", designation: "QA Engineer" },
  { name: "Grace Yellow", designation: "Business Analyst" },
  { name: "Hank Red", designation: "Project Manager" },
];

export default function PopularContributors() {
  const [contributors, setContributors] = useState([]);
  const getUsers = async () => {
    try {
      const res = await apiClient.get("/profile/users");
      console.log("Response : ", res.data);
      setContributors(res.data);
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div
      className="flex gap-8 sm:gap-12 md:gap-28 max-w-[1224px] overflow-x-auto scrollbar-width-none py-8"
      style={{ overflowX: "auto", scrollbarWidth: "none" }}
    >
      {contributors.map((contributor, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center w-max "
        >
          <div className="h-10 w-10 sm:h-20 sm:w-20 rounded-full flex justify-center items-center border-4 border-gray-300">
            <Avatar className="h-16 w-16 cursor-pointer">
              <AvatarImage
                src={
                  contributor.image || `https://github.com/shadcn.png?${index}`
                }
                alt={contributor.username}
              />
              <AvatarFallback>{contributor.username}</AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-2">
            <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-nowrap mt-2 text-gray-900">
              {contributor.username}
            </h3>
            <p className="text-xs text-gray-500 mt-2">{contributor.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
