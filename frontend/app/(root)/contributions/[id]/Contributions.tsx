"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/api/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDarkMode } from "@/hooks/useDarkMode";

interface Contribution {
  _id: string;
  roadmapId: string;
  contributedDocumentIds: string[];
  contributorEmail: string;
  contributions: {
    id: string;
    content: {
      data: string;
    };
  }[];
}

async function getContributions(roadmapId: string): Promise<Contribution[]> {
  try {
    const res = await apiClient.get(`/roadmap/${roadmapId}/contributions`);
    return res.data;
  } catch (error) {
    console.error("Error fetching contributions:", error);
    throw error;
  }
}

export default function ContributionsPage() {
  const params = useParams();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (params.id) {
      setIsLoading(true);
      getContributions(params.id as string)
        .then((data) => {
          console.log("Data : ", data);
          setContributions(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch contributions. Please try again later.");
          setIsLoading(false);
        });
    }
  }, [params.id]);

  if (isLoading) {
    return <div className="text-center p-4">Loading contributions...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <>
      {contributions.length != 0 ? (
        <div className="container mx-auto p-4">
          <h1
            className={`text-2xl font-bold mb-4 ${isDarkMode && "text-white"} `}
          >
            Contributions for Roadmap
          </h1>
          <ScrollArea className="h-max rounded-md border p-4">
            {contributions.map((contribution) => (
              <Card key={contribution._id} className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Avatar className="mr-2">
                      <AvatarFallback>
                        {contribution.contributorEmail[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {contribution.contributorEmail}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {contribution.contributions.map((item) => (
                    <div key={item.id} className="mb-2">
                      <p className="text-sm text-gray-500">ID: {item.id}</p>
                      <p className="mt-1">{item.content.data}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>
      ) : (
        <div className={`pb-10 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          No contributions
        </div>
      )}
    </>
  );
}
