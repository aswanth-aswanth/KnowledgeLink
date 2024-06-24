// src/components/NestedNoteTaker.tsx
"use client";
import React, { useState, useCallback } from "react";
import TopicNode from "./TopicNode";
import { Topic } from "@/types";

const NestedNoteTaker: React.FC = () => {
  const [topics, setTopics] = useState<Topic>({
    name: "Root",
    content: "",
    no: "0",
    children: [],
  });

  const addTopic = useCallback((parentNo: string) => {
    setTopics((prevTopics) => {
      const updatedTopics = { ...prevTopics };
      const parent = findTopicByNo(updatedTopics, parentNo);
      const newTopic: Topic = {
        name: "New Topic",
        content: "",
        no: getNextNo(parent || updatedTopics),
        children: [],
      };

      if (parent) {
        parent.children = [...parent.children, newTopic];
      } else {
        updatedTopics.children = [...updatedTopics.children, newTopic];
      }
      return updatedTopics;
    });
  }, []);

  const updateTopic = useCallback(
    (no: string, field: keyof Topic, value: string) => {
      setTopics((prevTopics) => {
        const updatedTopics = { ...prevTopics };
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

  console.log("topics : ", topics);

  return (
    <div className="nested-note-taker bg-white shadow-lg rounded-lg p-6">
      <button
        onClick={() => addTopic("0")}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mb-4 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Add Root Topic
      </button>
      {topics.children.map((topic) => (
        <TopicNode
          key={topic.no}
          topic={topic}
          addTopic={addTopic}
          updateTopic={updateTopic}
        />
      ))}
    </div>
  );
};

export default NestedNoteTaker;
