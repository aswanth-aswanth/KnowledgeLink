"use client";
import React, { useCallback, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Plus, Trash, Upload, Type, AlignLeft, Edit } from "lucide-react";
import { RootState, AppDispatch } from "@/store";
import {
  addTopic,
  resetTopics,
  setEditorData,
  updateRoadmapInfo,
} from "@/store/topicsSlice";
import { useDarkMode } from "@/hooks/useDarkMode";
import ChooseRoadmapType from "./ChooseRoadmapType";
import TopicNode from "./TopicNode";
import Image from "next/image";

const NestedNoteTaker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rootTopic = useSelector(
    (state: RootState) => state.topics.topics[state.topics.rootId]
  );
  const roadmapInfo = useSelector(
    (state: RootState) => state.topics.roadmapInfo
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode } = useDarkMode();
  const router = useRouter();
  const [showRoadmapInfo, setShowRoadmapInfo] = useState(false);

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

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          dispatch(updateRoadmapInfo({ image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    },
    [dispatch]
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateRoadmapInfo({ title: e.target.value }));
    },
    [dispatch]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(updateRoadmapInfo({ description: e.target.value }));
    },
    [dispatch]
  );

  const currentTopicsState = useSelector((state: RootState) => state.topics);

  console.log("Current topics state:", currentTopicsState);

  function transformTopics(topics: any) {
    const root = topics.root;

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

    return populateChildren(root);
  }

  const handleContinue = useCallback(() => {
    const transformedTopics: any = transformTopics(currentTopicsState.topics);
    dispatch(setEditorData(transformedTopics));
    router.push("/svg2");
  }, [currentTopicsState.topics, dispatch, router]);

  const toggleRoadmapInfo = useCallback(() => {
    setShowRoadmapInfo((prev) => !prev);
  }, []);

  return (
    <>
      <div
        className={`nested-note-taker rounded-lg overflow-hidden ${
          isDarkMode ? "bg-gray-900 shadow-lg" : "bg-white shadow-sm"
        }`}
      >
        <button
          onClick={toggleRoadmapInfo}
          className={`w-full py-2 px-4 flex items-center justify-center ${
            isDarkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          } transition-colors duration-200`}
        >
          <Edit size={16} className="mr-2" />
          {showRoadmapInfo ? "Hide Roadmap Info" : "Edit Roadmap Info"}
        </button>

        {showRoadmapInfo && (
          <>
            <div className="relative w-full h-48">
              {roadmapInfo.image ? (
                <Image
                  src={roadmapInfo.image}
                  alt="Roadmap Cover"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-200"
                  }`}
                >
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center justify-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <Upload size={24} className="mr-2" />
                    <span>Upload Cover Image</span>
                  </button>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="p-4">
              <div
                className={`flex items-center mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                <Type size={18} className="mr-2" />
                <input
                  type="text"
                  value={roadmapInfo.title}
                  onChange={handleTitleChange}
                  placeholder="Roadmap Title"
                  className={`w-full px-2 py-1 text-lg font-bold ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-800"
                  } rounded`}
                />
              </div>

              <div
                className={`flex items-start mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                <AlignLeft size={18} className="mr-2 mt-1" />
                <textarea
                  value={roadmapInfo.description}
                  onChange={handleDescriptionChange}
                  placeholder="Roadmap Description"
                  className={`w-full px-2 py-1 ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-800"
                  } rounded`}
                  rows={2}
                />
              </div>
            </div>
          </>
        )}

        <div className="p-4">
          <button
            onClick={handleAddRootTopic}
            className={`flex items-center justify-center w-full py-2 px-4 mb-4 ${
              isDarkMode
                ? "text-gray-300 bg-gray-800 hover:bg-gray-700"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            } rounded-md transition-colors duration-200`}
          >
            <Plus size={16} className="mr-2" />
            Add Root Topic
          </button>

          <div className="flex justify-end">
            <button
              onClick={handleResetTopics}
              className={`flex items-center justify-center w-max py-2 px-4 mb-4 ${
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
      </div>
      <div className="flex justify-end mt-8"></div>
      <ChooseRoadmapType onContinue={handleContinue} />
    </>
  );
};

export default NestedNoteTaker;
