"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { cn } from "@/lib/utils";
import apiClient from "@/api/apiClient";
import { useRouter } from "next/navigation";

interface Roadmap {
  _id: string;
  title: string;
  description: string;
  type: string;
}

export default function RoadmapList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useDarkMode();
  const router = useRouter();

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const response = await apiClient("/roadmap/all");
      const { data } = response;
      console.log("Roadmaps data: ", data);
      setRoadmaps(data);
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const filteredRoadmaps = roadmaps.filter((roadmap) =>
    roadmap.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={cn("p-4 rounded-lg", isDarkMode ? "bg-gray-800" : "bg-white")}
    >
      <h1
        className={cn(
          "text-2xl font-bold mb-4",
          isDarkMode ? "text-white" : "text-gray-800"
        )}
      >
        All Roadmaps
      </h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <Input
            type="text"
            placeholder="Search roadmaps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "pl-10",
              isDarkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-800"
            )}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoadmaps.map((roadmap) => (
              <TableRow key={roadmap._id}>
                <TableCell
                  onClick={() => router.push(`/admin/roadmaps/${roadmap._id}`)}
                  className="font-medium cursor-pointer"
                >
                  {roadmap.title}
                </TableCell>
                <TableCell>{roadmap.description}</TableCell>
                <TableCell>{roadmap.type}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/roadmap/edit/${roadmap._id}`)
                        }
                      >
                        Edit Roadmap
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(`/roadmap/${roadmap._id}`)}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete Roadmap
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
