"use client";
import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Plus, Trash, Edit } from "lucide-react";
import { v4 as uuid } from "uuid";
import { RootState, AppDispatch } from "@/store";
import {
  addTopic,
  resetTopics,
  setEditorData,
  setRootTitleAndContent,
} from "@/store/topicsSlice";
import { useDarkMode } from "@/hooks/useDarkMode";
import ChooseRoadmapType from "./ChooseRoadmapType";
import TopicNode from "./TopicNode";

const NestedNoteTaker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rootTopic = useSelector(
    (state: RootState) => state.topics.topics[state.topics.rootId]
  );
  const { isDarkMode } = useDarkMode();
  const [roadmapType, setRoadmapType] = useState("public_voting");
  const router = useRouter();

  const [showRootEditModal, setShowRootEditModal] = useState(false);
  const [rootTitle, setRootTitle] = useState(rootTopic.name);
  const [rootContent, setRootContent] = useState(rootTopic.content);

  const handleEditRoot = useCallback(() => {
    setShowRootEditModal(true);
  }, []);

  const handleSaveRoot = useCallback(() => {
    dispatch(
      setRootTitleAndContent({ title: rootTitle, content: rootContent })
    );
    setShowRootEditModal(false);
  }, [dispatch, rootTitle, rootContent]);

  const handleAddRootTopic = useCallback(() => {
    const newTopic = {
      id: uuid().slice(0, 13),
      name: "New Topic",
      content: "",
      no: `${rootTopic.children.length + 1}`,
      children: [],
      isExpanded: false,
    };
    dispatch(addTopic({ parentId: rootTopic.id, newTopic }));
  }, [dispatch, rootTopic.id, rootTopic.children.length]);

  const handleResetTopics = useCallback(() => {
    dispatch(resetTopics());
  }, [dispatch]);

  const currentTopicsState = useSelector((state: RootState) => state.topics);

  console.log("Current topics state:", currentTopicsState);

  function transformTopics(topics: any) {
    const root = topics.root;
    const newRootId = uuid().slice(0, 13);

    function populateChildren(node: any) {
      const { isExpanded, ...cleanedNode } = node;
      return {
        uniqueId: uuid().slice(0, 13),
        name: cleanedNode.name,
        content: cleanedNode.content,
        tags: [],
        children: node.children.map((childId: string) => {
          const childNode = topics[childId];
          return populateChildren(childNode);
        }),
      };
    }

    const transformedRoot = populateChildren(root);

    return {
      uniqueId: uuid().slice(0, 13),
      title: transformedRoot.name,
      description: transformedRoot.content,
      type: roadmapType,
      tags: [],
      members: [],
      creatorId: "",
      topics: transformedRoot,
      createdAt: "",
      updatedAt: "",
      id: newRootId,
    };
  }

  console.log(
    "TransformedTopics : ",
    transformTopics(currentTopicsState.topics)
  );

  const handleContinue = useCallback(
    (selectedRoadmapType: string, selectedMembers: any[]) => {
      const transformedTopics: any = transformTopics(currentTopicsState.topics);
      transformedTopics.members = selectedMembers.map((member) => member.email);
      transformedTopics.type = selectedRoadmapType; // Use the selected type
      dispatch(setEditorData(transformedTopics));
      router.push("/svg2");
    },
    [currentTopicsState.topics, dispatch, router]
  );

  return (
    <>
      <div
        className={`nested-note-taker rounded-lg ${
          isDarkMode ? "bg-gray-900 shadow-lg" : "bg-white shadow-sm"
        } p-6`}
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleAddRootTopic}
            className={`flex items-center justify-center py-2 px-4 ${
              isDarkMode
                ? "text-gray-300 bg-gray-800 hover:bg-gray-700"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            } rounded-md transition-colors duration-200`}
          >
            <Plus size={16} className="mr-2" />
            Add Root Topic
          </button>
          <button
            onClick={handleEditRoot}
            className={`flex items-center justify-center py-2 px-4 ${
              isDarkMode
                ? "text-gray-300 bg-gray-800 hover:bg-gray-700"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            } rounded-md transition-colors duration-200`}
          >
            <Edit size={16} className="mr-2" />
            Edit Root
          </button>
          <button
            onClick={handleResetTopics}
            className={`flex items-center justify-center py-2 px-4 ${
              isDarkMode
                ? "text-red-400 bg-red-900 hover:bg-red-800"
                : "text-red-600 bg-red-100 hover:bg-red-200"
            } rounded-md transition-colors duration-200`}
          >
            <Trash size={16} className="mr-2" />
            Reset
          </button>
        </div>
        {rootTopic.children.map((childId) => (
          <TopicNode key={childId} id={childId} />
        ))}
      </div>
      <div className="flex justify-end py-8">
        <ChooseRoadmapType
          onContinue={handleContinue}
          roadmapType={roadmapType}
          setRoadmapType={setRoadmapType}
        />
      </div>
      {showRootEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className={`bg-white p-6 rounded-lg ${
              isDarkMode ? "bg-gray-800" : ""
            }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                isDarkMode ? "text-white" : ""
              }`}
            >
              Edit Root Topic
            </h2>
            <input
              type="text"
              value={rootTitle}
              onChange={(e) => setRootTitle(e.target.value)}
              className={`w-full p-2 mb-4 rounded ${
                isDarkMode ? "bg-gray-700 text-white" : ""
              }`}
              placeholder="Root Title"
            />
            <textarea
              value={rootContent}
              onChange={(e) => setRootContent(e.target.value)}
              className={`w-full p-2 mb-4 rounded ${
                isDarkMode ? "bg-gray-700 text-white" : ""
              }`}
              placeholder="Root Content"
              rows={4}
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowRootEditModal(false)}
                className={`mr-2 px-4 py-2 rounded ${
                  isDarkMode ? "bg-gray-600 text-white" : "bg-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoot}
                className={`px-4 py-2 rounded ${
                  isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NestedNoteTaker;
