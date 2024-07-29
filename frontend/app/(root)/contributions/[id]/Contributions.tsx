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
  const { isDarkMode } = useDarkMode();

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
  if (contributions.length === 0)
    return <NoContributionsMessage isDarkMode={isDarkMode} />;

  return (
    <div className="container mx-auto p-4">
      <h1
        className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : ""}`}
      >
        Contributions for Roadmap
      </h1>
      <ScrollArea className="h-max rounded-md border p-4">
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
  <div className="text-center p-4">Loading contributions...</div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-center p-4 text-red-500">{message}</div>
);

const NoContributionsMessage = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className={`pb-10 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
    No contributions
  </div>
);

const ContributionCard = ({ contribution }: { contribution: Contribution }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="flex items-center">
        <Avatar className="mr-2">
          <AvatarFallback />
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
);
