"use client";
import React, { useState } from "react";
import { useRoadmap } from "../../contexts/RoadmapContext";
import {
  Container,
  Input,
  Button,
  Heading,
  Paragraph,
  CollapsibleContent,
} from "./styles";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const RoadmapForm: React.FC = () => {
  const { roadmap, setRoadmap, addHeading, addParagraph, toggleCollapse } =
    useRoadmap();
  const [headingName, setHeadingName] = useState("");
  const [paragraphContent, setParagraphContent] = useState("");

  const handleAddHeading = () => {
    if (headingName.trim()) {
      addHeading(headingName);
      setHeadingName("");
    }
  };

  const handleAddParagraph = (index: number) => {
    if (paragraphContent.trim()) {
      addParagraph(paragraphContent);
      setParagraphContent("");
    }
  };

  return (
    <Container className="mt-40">
      <Input
        type="text"
        placeholder="Roadmap Title"
        value={roadmap.title}
        onChange={(e) =>
          setRoadmap((prev) => ({ ...prev, title: e.target.value }))
        }
      />
      <Input
        type="text"
        placeholder="Roadmap Description"
        value={roadmap.description}
        onChange={(e) =>
          setRoadmap((prev) => ({ ...prev, description: e.target.value }))
        }
      />
      <Input
        type="text"
        placeholder="Enter heading"
        value={headingName}
        onChange={(e) => setHeadingName(e.target.value)}
      />
      <Button onClick={handleAddHeading}>Add Heading</Button>
      <div>
        {roadmap.topics.map((topic, index) => (
          <div key={index}>
            <Heading onClick={() => toggleCollapse(index)}>
              {topic.name}
            </Heading>
            {!topic.collapsed && (
              <CollapsibleContent>
                <ReactQuill
                  theme="snow"
                  value={paragraphContent}
                  onChange={setParagraphContent}
                  placeholder="Enter paragraph content"
                />
                <Button onClick={() => handleAddParagraph(index)}>
                  Add Paragraph
                </Button>
                {topic.children.map((child, idx) => (
                  <Paragraph key={idx}>{child.content}</Paragraph>
                ))}
              </CollapsibleContent>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default RoadmapForm;
