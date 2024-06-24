"use client";
import React, { useCallback } from "react";
import TopicNode from "./TopicNode";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { addTopic, resetTopics } from "@/store/topicsSlice";
import { Plus, Trash } from "lucide-react";

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

  // console.log("Current topics state:", currentTopicsState); 

  return (
    <div className="nested-note-taker bg-white shadow-sm rounded-lg p-6">
      <button
        onClick={handleAddRootTopic}
        className="flex items-center justify-center w-full py-2 px-4 mb-4 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
      >
        <Plus size={16} className="mr-2" />
        Add Root Topic
      </button>
      <div className="flex justify-end">
        <button
          onClick={handleResetTopics}
          className="flex items-center justify-center w-max  py-2 px-4 mb-4 text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors duration-200"
        >
          <Trash size={12} className="mr-2 " />
          Reset Topics
        </button>
      </div>
      {rootTopic.children.map((childId) => (
        <TopicNode key={childId} id={childId} />
      ))}
    </div>
  );
};

export default NestedNoteTaker;
