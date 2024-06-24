"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Topic {
  name: string;
  content: string;
  no: string;
  children: Topic[];
}

interface Roadmap {
  title: string;
  description: string;
  topics: Topic[];
}

interface RoadmapContextType {
  roadmap: Roadmap;
  setRoadmap: React.Dispatch<React.SetStateAction<Roadmap>>;
  addTopic: (parentNo: string, name: string) => void;
  toggleCollapse: (no: string) => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};

export const RoadmapProvider = ({ children }: { children: ReactNode }) => {
  const [roadmap, setRoadmap] = useState<Roadmap>({
    title: '',
    description: '',
    topics: [],
  });

  const addTopic = (parentNo: string, name: string) => {
    const addToChildren = (topics: Topic[]): Topic[] => {
      return topics.map((topic) => {
        if (topic.no === parentNo) {
          const newTopic: Topic = {
            name,
            content: '',
            no: `${topic.no}-${topic.children.length + 1}`,
            children: [],
          };
          return { ...topic, children: [...topic.children, newTopic] };
        } else {
          return { ...topic, children: addToChildren(topic.children) };
        }
      });
    };

    if (parentNo === 'root') {
      const newTopic: Topic = {
        name,
        content: '',
        no: `${roadmap.topics.length + 1}`,
        children: [],
      };
      setRoadmap((prev) => ({ ...prev, topics: [...prev.topics, newTopic] }));
    } else {
      setRoadmap((prev) => ({
        ...prev,
        topics: addToChildren(prev.topics),
      }));
    }
  };

  const toggleCollapse = (no: string) => {
    // Implement collapse logic if needed
  };

  return (
    <RoadmapContext.Provider value={{ roadmap, setRoadmap, addTopic, toggleCollapse }}>
      {children}
    </RoadmapContext.Provider>
  );
};
