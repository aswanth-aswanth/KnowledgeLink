"use client";
import React, { useCallback } from "react";
import TopicNode from "./TopicNode";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { addTopic, resetTopics } from "@/store/topicsSlice";
import { Plus, Trash } from "lucide-react";
import ChooseRoadmapType from "./ChooseRoadmapType";

const NestedNoteTaker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rootTopic = useSelector(
    (state: RootState) => state.topics.topics[state.topics.rootId]
  );

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

  return (
    <>
      <div className="nested-note-taker bg-gray-900 shadow-lg rounded-lg p-6">
        <button
          onClick={handleAddRootTopic}
          className="flex items-center justify-center w-full py-2 px-4 mb-4 text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors duration-200"
        >
          <Plus size={16} className="mr-2" />
          Add Root Topic
        </button>
        <div className="flex justify-end">
          <button
            onClick={handleResetTopics}
            className="flex items-center justify-center w-max py-4 px-4 mb-4 text-red-400 bg-red-900 hover:bg-red-800 rounded-md transition-colors duration-200"
          >
            <Trash size={16} />
          </button>
        </div>
        {rootTopic.children.map((childId) => (
          <TopicNode key={childId} id={childId} />
        ))}
      </div>
      <div className="flex justify-end mt-8"></div>
      <ChooseRoadmapType />
    </>
  );
};

export default NestedNoteTaker;
