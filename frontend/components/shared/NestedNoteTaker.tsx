"use client";
import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Plus, Trash } from "lucide-react";
import { RootState, AppDispatch } from "@/store";
import { addTopic, resetTopics, setEditorData } from "@/store/topicsSlice";
import { useDarkMode } from "@/hooks/useDarkMode";
import ChooseRoadmapType from "./ChooseRoadmapType";
import TopicNode from "./TopicNode";

const NestedNoteTaker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rootTopic = useSelector(
    (state: RootState) => state.topics.topics[state.topics.rootId]
  );
  const { isDarkMode } = useDarkMode();
  const router = useRouter();

  const handleAddRootTopic = useCallback(() => {
    const newTopic = {
      id: Date.now().toString(),
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
    const newRootId = Date.now().toString();

    function populateChildren(node: any) {
      if (!node.children || node.children.length === 0) {
        const { isExpanded, ...cleanedNode } = node;
        return { ...cleanedNode, children: [] };
      }

      const { isExpanded, ...cleanedNode } = node;
      return {
        ...cleanedNode,
        children: node.children.map((childId: string) => {
          const childNode = topics[childId];
          return populateChildren(childNode);
        }),
      };
    }

    const transformedRoot = populateChildren(root);

    return {
      ...transformedRoot,
      rootId: newRootId,
    };
  }

  console.log("transformTopics : ", transformTopics(currentTopicsState.topics));
  const handleContinue = useCallback(() => {
    const transformedTopics: any = transformTopics(currentTopicsState.topics);
    dispatch(setEditorData(transformedTopics));
    router.push("/svg2");
  }, [currentTopicsState.topics, dispatch, router]);

  return (
    <>
      <div
        className={`nested-note-taker  rounded-lg ${
          isDarkMode ? "bg-gray-900 shadow-lg" : "bg-white shadow-sm"
        } p-6`}
      >
        <button
          onClick={handleAddRootTopic}
          className={`flex items-center justify-center w-full py-2 px-4 mb-4  ${
            isDarkMode
              ? "text-gray-300 bg-gray-800 hover:bg-gray-700 "
              : "text-gray-600 bg-gray-100 hover:bg-gray-200"
          } rounded-md transition-colors duration-200`}
        >
          <Plus size={16} className="mr-2" />
          Add Root Topic
        </button>
        <div className="flex justify-end">
          <button
            onClick={handleResetTopics}
            className={`flex items-center justify-center w-max   py-4 px-4 mb-4 ${
              isDarkMode
                ? "text-red-400 bg-red-900 hover:bg-red-800"
                : "text-red-600 bg-red-100 hover:bg-red-200"
            } rounded-md transition-colors duration-200`}
          >
            <Trash size={16} />
          </button>
        </div>
        {rootTopic.children.map((childId) => (
          <TopicNode key={childId} id={childId} />
        ))}
      </div>
      <div className="flex justify-end mt-8"></div>
      <ChooseRoadmapType onContinue={handleContinue} />
    </>
  );
};

export default NestedNoteTaker;
