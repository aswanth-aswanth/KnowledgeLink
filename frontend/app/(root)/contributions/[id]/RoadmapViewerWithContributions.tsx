"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useToast } from "@/components/ui/use-toast";
import ContributionsPage from "./Contributions";

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

interface Topic {
  _id: string;
  name: string;
  content: string;
  uniqueId: string;
  contributorId: string | null;
  tags: string[];
  children: Topic[];
}

interface RoadmapData {
  _id: string;
  title: string;
  description: string;
  topics: Topic;
  creatorEmail?: string;
}

async function getRoadmapData(id: string): Promise<RoadmapData> {
  const res = await apiClient.get(`/roadmap/${id}`);
  console.log("getRoadmapData : ", res.data);
  return res.data;
}

async function getContributions(roadmapId: string): Promise<Contribution[]> {
  const res = await apiClient.get(`/roadmap/${roadmapId}/contributions`);
  console.log("Contributions : ", res.data);
  return res.data;
}

async function mergeContribution(roadmapId: string, mergeData: any) {
  console.group("MergeContribution");
  console.log("MergeData : ", mergeData);
  console.log("roadmapId : ", roadmapId);
  console.groupEnd();

  const res = await apiClient.patch(`/roadmap/${roadmapId}/merge`, mergeData);
  return res.data;
}

const AnimatedHighlight = () => (
  <div className="absolute -inset-1 bg-blue-500 opacity-75 rounded-lg blur animate-pulse"></div>
);

const TopicWithContributions: React.FC<{
  topic: Topic;
  contributions: Contribution[];
  level: string;
  onMerge: (topicId: string, contributorEmail: string, content: string) => void;
}> = ({ topic, contributions, level, onMerge }) => {
  const { isDarkMode } = useDarkMode();
  const [isExpanded, setIsExpanded] = useState(false);

  const topicContributions = contributions.filter((c) =>
    c.contributions.some((cont) => cont.id === topic.uniqueId)
  );

  const hasDirectContribution = topicContributions.length > 0;

  const hasChildContribution = topic.children.some(
    (child) =>
      contributions.some((c) =>
        c.contributions.some((cont) => cont.id === child.uniqueId)
      ) || child.children.length > 0
  );

  const shouldHighlight = hasDirectContribution || hasChildContribution;

  return (
    <div className="topic-node mb-3">
      <div className="flex items-center group">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-md ${
            isDarkMode
              ? "text-gray-500 hover:bg-gray-800"
              : "text-gray-400 hover:bg-gray-100"
          } focus:outline-none`}
        >
          {isExpanded ? (
            <ChevronDown
              size={16}
              className={isDarkMode ? "text-gray-300" : "text-black"}
            />
          ) : (
            <ChevronRight
              size={16}
              className={isDarkMode ? "text-gray-300" : "text-black"}
            />
          )}
        </button>
        <span
          className={`flex-grow px-2 py-1 rounded-md font-bold text-lg ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {topic.name}
        </span>
        <span
          className={`text-xs ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          } mr-2`}
        >
          {level}
        </span>
        {shouldHighlight && (
          <Circle
            size={12}
            className="text-blue-500 animate-pulse"
            fill="currentColor"
          />
        )}
      </div>
      {isExpanded && (
        <div className="ml-6 mt-2">
          <div
            className={`h-min bg-transparent p-2 mb-2 rounded-md transition-all duration-200 prose font-medium prose-sm text-base tracking-wider ${
              isDarkMode ? " text-gray-300" : "bg-gray-50 text-gray-600"
            } leading-9 max-w-none`}
            dangerouslySetInnerHTML={{ __html: topic.content }}
          />
          {topicContributions.map((contribution) => (
            <Card
              key={contribution._id}
              className={`h-min bg-transparent p-0 mb-2 rounded-md transition-all duration-200 prose font-medium prose-sm text-base tracking-wider ${
                isDarkMode ? " text-gray-300" : "bg-gray-50 text-gray-600"
              } leading-9 max-w-none`}
            >
              <CardHeader>
                <CardTitle className="text-sm">
                  Contribution by {contribution.contributorEmail}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contribution.contributions
                  .filter((cont) => cont.id === topic.uniqueId)
                  .map((cont) => (
                    <div key={cont.id} className="mb-2">
                      <p>{cont.content.data}</p>
                      <Button
                        onClick={() =>
                          onMerge(
                            topic.uniqueId,
                            contribution.contributorEmail,
                            cont.content.data
                          )
                        }
                        className="mt-2"
                      >
                        Merge
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}

          {topic.children.map((child, index) => (
            <TopicWithContributions
              key={child.uniqueId}
              topic={child}
              contributions={contributions}
              level={`${level}-${index + 1}`}
              onMerge={onMerge}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function RoadmapViewerWithContributions() {
  const params = useParams();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const { toast } = useToast();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (params.id) {
      Promise.all([
        getRoadmapData(params.id as string),
        getContributions(params.id as string),
      ])
        .then(([roadmap, contribs]) => {
          setRoadmapData(roadmap);
          setContributions(contribs);
        })
        .catch(console.error);
    }
  }, [params.id]);

  const handleMerge = async (
    topicId: string,
    contributorEmail: string,
    content: string
  ) => {
    try {
      const mergeData = {
        contributorEmail,
        contributedDocument: {
          id: topicId,
          data: {
            content: `${content}`,
          },
        },
      };

      await mergeContribution(params.id as string, mergeData);
      toast({
        title: "Contribution merged",
        description: "The contribution has been successfully merged.",
      });
      // Refresh the roadmap data and contributions
      const [updatedRoadmap, updatedContribs] = await Promise.all([
        getRoadmapData(params.id as string),
        getContributions(params.id as string),
      ]);
      setRoadmapData(updatedRoadmap);
      setContributions(updatedContribs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge contribution. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!roadmapData || !roadmapData.topics.children) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ContributionsPage />
      <h1
        className={`text-2xl font-bold ${
          isDarkMode ? "text-white" : "text-gray-500"
        } mb-4`}
      >
        {roadmapData.title}
      </h1>
      <p className={`mb-6 ${isDarkMode ? "text-white" : "text-gray-500"}`}>
        {roadmapData.description}
      </p>
      {roadmapData.topics.children.map((child, index) => (
        <TopicWithContributions
          key={child.uniqueId}
          topic={child}
          contributions={contributions}
          level={`${index + 1}`}
          onMerge={handleMerge}
        />
      ))}
    </div>
  );
}
