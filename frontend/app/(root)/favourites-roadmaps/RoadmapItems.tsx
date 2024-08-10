import React from "react";
import { useRouter, usePathname } from "next/navigation";
import apiClient from "@/api/apiClient";
import toast from "react-hot-toast";
import { CardProps } from "@/types/roadmap";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const RoadmapItems: React.FC<CardProps> = ({
  title,
  description,
  likes,
  id,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const subscribe = async () => {
    try {
      console.log("Subscribed to roadmap:", id);
      const res = await apiClient.post("/profile/subscribe", { roadmapId: id });
      toast.success(res.data.message);
      console.log("Response:", res);
    } catch (error) {
      toast.error("Subscription failed");
      console.log("Error:", error);
    }
  };

  return (
    <div
      onClick={() => router.push(`/roadmap-viewer/${id}`)}
      className="p-4 flex flex-col justify-between bg-white dark:bg-gray-800 min-h-[200px] w-full rounded-xl shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors duration-200"
    >
      <div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
      </div>
      <div className="flex items-center justify-end text-gray-500 dark:text-gray-400">
        {pathname !== "/favourites-roadmaps" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <DropdownMenuItem
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  subscribe();
                }}
              >
                Subscribe
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default RoadmapItems;
