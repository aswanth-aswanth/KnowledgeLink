"use client";
import React, { useState, useCallback } from "react";
import TopicNode from "./TopicNode";
import { Topic } from "@/types";
import { Plus } from "lucide-react";

const NestedNoteTaker: React.FC = () => {
  const [topics, setTopics] = useState<Topic>({
    name: "Root",
    content: "",
    no: "0",
    children: [],
  });

  const addTopic = useCallback((parentNo: string) => {
    setTopics((prevTopics) => {
      const updatedTopics = JSON.parse(JSON.stringify(prevTopics)); // Deep clone
      const parent = findTopicByNo(updatedTopics, parentNo);
      const newTopic: Topic = {
        name: "New Topic",
        content: "",
        no: getNextNo(parent || updatedTopics),
        children: [],
      };

      if (parent) {
        parent.children.push(newTopic);
      } else {
        updatedTopics.children.push(newTopic);
      }
      return updatedTopics;
    });
  }, []);

  const updateTopic = useCallback(
    (no: string, field: keyof Topic, value: string) => {
      setTopics((prevTopics) => {
        const updatedTopics = JSON.parse(JSON.stringify(prevTopics)); // Deep clone
        const topic = findTopicByNo(updatedTopics, no);
        if (topic) {
          topic[field] = value;
        }
        return updatedTopics;
      });
    },
    []
  );

  const findTopicByNo = (topic: Topic, no: string): Topic | null => {
    if (topic.no === no) return topic;
    for (const child of topic.children) {
      const found = findTopicByNo(child, no);
      if (found) return found;
    }
    return null;
  };

  const getNextNo = (parent: Topic): string => {
    const childrenCount = parent.children.length;
    return parent.no === "0"
      ? `${childrenCount + 1}`
      : `${parent.no}-${childrenCount + 1}`;
  };

  const deleteTopic = useCallback((no: string) => {
    setTopics((prevTopics) => {
      const updatedTopics = JSON.parse(JSON.stringify(prevTopics)); // Deep clone
      const deleteFromChildren = (children: Topic[]): Topic[] => {
        return children.filter((child) => {
          if (child.no === no) {
            return false;
          }
          child.children = deleteFromChildren(child.children);
          return true;
        });
      };
      updatedTopics.children = deleteFromChildren(updatedTopics.children);
      return updatedTopics;
    });
  }, []);

  console.log("topics : ", topics);

  return (
    <div className="nested-note-taker bg-white shadow-sm rounded-lg p-6">
      <button
        onClick={() => addTopic("0")}
        className="flex items-center justify-center w-full py-2 px-4 mb-4 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
      >
        <Plus size={16} className="mr-2" />
        Add Root Topic
      </button>
      {topics.children.map((topic) => (
        <TopicNode
          key={topic.no}
          topic={topic}
          addTopic={addTopic}
          updateTopic={updateTopic}
          deleteTopic={deleteTopic}
        />
      ))}
    </div>
  );
};

export default NestedNoteTaker;
