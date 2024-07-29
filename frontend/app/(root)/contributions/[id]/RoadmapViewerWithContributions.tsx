"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ContributionsPage from "./Contributions";

interface Contribution {
  _id: string;
  roadmapId: string;
  contributedDocumentIds: string[];
  contributorId: string;
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

const fetchRoadmapData = async (id: string): Promise<RoadmapData> => {
  const res = await apiClient.get(`/roadmap/${id}`);
  return res.data;
};

const fetchContributions = async (
  roadmapId: string
): Promise<Contribution[]> => {
  const res = await apiClient.get(`/roadmap/${roadmapId}/contributions`);
  return res.data;
};

const mergeContribution = async (roadmapId: string, mergeData: any) => {
  const res = await apiClient.patch(`/roadmap/${roadmapId}/merge`, mergeData);
  return res.data;
};

const TopicWithContributions: React.FC<{
  topic: Topic;
  contributions: Contribution[];
  level: string;
  onMerge: (topicId: string, contributorId: string, content: string) => void;
}> = ({ topic, contributions, level, onMerge }) => {
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
        <ExpandButton
          isExpanded={isExpanded}
          onClick={() => setIsExpanded(!isExpanded)}
        />
        <TopicTitle name={topic.name} level={level} />
        {shouldHighlight && <ContributionIndicator />}
      </div>
      {isExpanded && (
        <ExpandedTopicContent
          topic={topic}
          topicContributions={topicContributions}
          contributions={contributions}
          level={level}
          onMerge={onMerge}
        />
      )}
    </div>
  );
};

const ExpandButton: React.FC<{ isExpanded: boolean; onClick: () => void }> = ({
  isExpanded,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="p-2 rounded-md text-gray-400 hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-gray-800 focus:outline-none"
  >
    {isExpanded ? (
      <ChevronDown size={16} className="text-black dark:text-gray-300" />
    ) : (
      <ChevronRight size={16} className="text-black dark:text-gray-300" />
    )}
  </button>
);

const TopicTitle: React.FC<{ name: string; level: string }> = ({
  name,
  level,
}) => (
  <>
    <span className="flex-grow px-2 py-1 rounded-md font-bold text-lg text-gray-600 dark:text-gray-300">
      {name}
    </span>
    <span className="text-xs text-gray-400 dark:text-gray-500 mr-2">
      {level}
    </span>
  </>
);

const ContributionIndicator: React.FC = () => (
  <Circle
    size={12}
    className="text-blue-500 animate-pulse"
    fill="currentColor"
  />
);

const ExpandedTopicContent: React.FC<{
  topic: Topic;
  topicContributions: Contribution[];
  contributions: Contribution[];
  level: string;
  onMerge: (topicId: string, contributorId: string, content: string) => void;
}> = ({ topic, topicContributions, contributions, level, onMerge }) => (
  <div className="ml-6 mt-2">
    <TopicContent content={topic.content} />
    {topicContributions.map((contribution) => (
      <ContributionCard
        key={contribution._id}
        contribution={contribution}
        topicId={topic.uniqueId}
        onMerge={onMerge}
      />
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
);

const TopicContent: React.FC<{ content: string }> = ({ content }) => (
  <div
    className="h-min bg-transparent p-2 mb-2 rounded-md transition-all duration-200 prose font-medium prose-sm text-base tracking-wider text-gray-600 dark:text-gray-300 leading-9 max-w-none"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

const ContributionCard: React.FC<{
  contribution: Contribution;
  topicId: string;
  onMerge: (topicId: string, contributorId: string, content: string) => void;
}> = ({ contribution, topicId, onMerge }) => (
  <Card className="h-min bg-transparent p-0 mb-2 rounded-md transition-all duration-200 prose font-medium prose-sm text-base tracking-wider text-gray-600 dark:text-gray-300 leading-9 max-w-none">
    <CardHeader>
      <CardTitle className="text-sm">
        Contribution by {contribution.contributorId}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {contribution.contributions
        .filter((cont) => cont.id === topicId)
        .map((cont) => (
          <div key={cont.id} className="mb-2">
            <p>{cont.content.data}</p>
            <Button
              onClick={() =>
                onMerge(topicId, contribution.contributorId, cont.content.data)
              }
              className="mt-2"
            >
              Merge
            </Button>
          </div>
        ))}
    </CardContent>
  </Card>
);

export default function RoadmapViewerWithContributions() {
  const params = useParams();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (params.id) {
      fetchRoadmapData(params.id as string)
        .then(setRoadmapData)
        .catch(console.error);
      fetchContributions(params.id as string)
        .then(setContributions)
        .catch(console.error);
    }
  }, [params.id]);

  const handleMerge = async (
    topicId: string,
    contributorId: string,
    content: string
  ) => {
    try {
      const mergeData = {
        contributorId,
        contributedDocument: { id: topicId, data: { content } },
      };

      await mergeContribution(params.id as string, mergeData);
      toast({
        title: "Contribution merged",
        description: "The contribution has been successfully merged.",
      });

      const [updatedRoadmap, updatedContribs] = await Promise.all([
        fetchRoadmapData(params.id as string),
        fetchContributions(params.id as string),
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
      <h1 className="text-2xl font-bold text-gray-500 dark:text-white mb-4">
        {roadmapData.title}
      </h1>
      <p className="mb-6 text-gray-500 dark:text-white">
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
