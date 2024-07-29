"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/api/apiClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

async function fetchContributions(roadmapId: string): Promise<Contribution[]> {
  try {
    const response = await apiClient.get(`/roadmap/${roadmapId}/contributions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching contributions:", error);
    throw error;
  }
}

export default function ContributionsPage() {
  const { id: roadmapId } = useParams();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContributions() {
      if (!roadmapId) return;

      try {
        setIsLoading(true);
        const data = await fetchContributions(roadmapId as string);
        setContributions(data);
      } catch (err) {
        setError("Failed to fetch contributions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadContributions();
  }, [roadmapId]);

  if (isLoading) return <LoadingMessage />;
  if (error) return <ErrorMessage message={error} />;
  if (contributions.length === 0) return <NoContributionsMessage />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Contributions for Roadmap
      </h1>
      <ScrollArea className="h-max rounded-md border p-4 dark:border-gray-700">
        {contributions.map((contribution) => (
          <ContributionCard
            key={contribution._id}
            contribution={contribution}
          />
        ))}
      </ScrollArea>
    </div>
  );
}

const LoadingMessage = () => (
  <div className="text-center p-4 text-gray-800 dark:text-gray-200">
    Loading contributions...
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-center p-4 text-red-500 dark:text-red-400">
    {message}
  </div>
);

const NoContributionsMessage = () => (
  <div className="pb-10 text-gray-800 dark:text-gray-200">No contributions</div>
);

const ContributionCard = ({ contribution }: { contribution: Contribution }) => (
  <Card className="mb-4 bg-white dark:bg-gray-800 border dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center text-gray-800 dark:text-white">
        <Avatar className="mr-2 bg-gray-200 dark:bg-gray-700">
          <AvatarFallback className="text-gray-600 dark:text-gray-300">
          </AvatarFallback>
        </Avatar>
      </CardTitle>
    </CardHeader>
    <CardContent>
      {contribution.contributions.map((item) => (
        <div key={item.id} className="mb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID: {item.id}
          </p>
          <p className="mt-1 text-gray-700 dark:text-gray-300">
            {item.content.data}
          </p>
        </div>
      ))}
    </CardContent>
  </Card>
);
