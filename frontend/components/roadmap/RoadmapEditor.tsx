"use client";
import React, { useState } from "react";
import { useRoadmap } from "../../contexts/RoadmapContext";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EditableDiv = styled.div`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: text;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const IndentedContainer = styled.div`
  margin-left: 20px;
  padding-left: 10px;
  border-left: 2px solid #ddd;
`;

const RoadmapEditor: React.FC = () => {
  const { roadmap, addTopic } = useRoadmap();
  const [currentTopic, setCurrentTopic] = useState("");

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    no: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTopic(no, currentTopic);
      setCurrentTopic("");
    }
  };

  const renderTopics = (topics: Topic[], parentNo: string) => {
    return topics.map((topic) => (
      <div key={topic.no}>
        <EditableDiv
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => addTopic(parentNo, e.target.innerText)}
          onKeyDown={(e) => handleKeyDown(e, parentNo)}
        >
          {topic.name}
        </EditableDiv>
        {topic.children.length > 0 && (
          <IndentedContainer>
            {renderTopics(topic.children, topic.no)}
          </IndentedContainer>
        )}
      </div>
    ));
  };

  return (
    <Container>
      <EditableDiv
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => addTopic("root", e.target.innerText)}
        onKeyDown={(e) => handleKeyDown(e, "root")}
      >
        Type a new topic...
      </EditableDiv>
      {renderTopics(roadmap.topics, "root")}
    </Container>
  );
};

export default RoadmapEditor;
