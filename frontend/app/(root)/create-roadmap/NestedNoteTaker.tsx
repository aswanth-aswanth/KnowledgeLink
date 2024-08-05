"use client";
import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Plus, Trash, Edit, AlertCircle } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const NestedNoteTaker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rootTopic = useSelector(
    (state: RootState) => state.topics.topics[state.topics.rootId]
  );
  const { isDarkMode } = useDarkMode();
  const [roadmapType, setRoadmapType] = useState("public_voting");
  const router = useRouter();

  const [showRootEditModal, setShowRootEditModal] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showEmptyRootWarning, setShowEmptyRootWarning] = useState(false);
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
    setShowResetConfirmation(true);
  }, []);

  const confirmResetTopics = useCallback(() => {
    dispatch(resetTopics());
    setShowResetConfirmation(false);
    toast({
      title: "Topics Reset",
      description: "All topics have been reset to the initial state.",
    });
  }, [dispatch]);

  const currentTopicsState = useSelector((state: RootState) => state.topics);
  console.log("Current topic state : ", currentTopicsState);

  function transformTopics(topics: any) {
    const root = topics.root;
    const newRootId = uuid().slice(0, 13);
    const mediaFiles: { file: File; placeholder: string; topicId: string }[] =
      [];

    function populateChildren(node: any) {
      const { isExpanded, ...cleanedNode } = node;
      const topicId = uuid().slice(0, 13);

      // Process content to extract media files and replace with placeholders
      const processedContent = processContent(cleanedNode.content, topicId);

      return {
        uniqueId: topicId,
        name: cleanedNode.name,
        content: processedContent,
        tags: [],
        children: node.children.map((childId: string) => {
          const childNode = topics[childId];
          return populateChildren(childNode);
        }),
      };
    }

    function processContent(content: string, topicId: string): string {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");

      doc.querySelectorAll(".media-container").forEach((container, index) => {
        const mediaElement = container.querySelector("img, video");
        if (
          mediaElement instanceof HTMLImageElement ||
          mediaElement instanceof HTMLVideoElement
        ) {
          const dataUrl = mediaElement.src;
          if (dataUrl.startsWith("data:")) {
            const file = dataURLtoFile(dataUrl, `media_${topicId}_${index}`);
            const placeholder = `{{MEDIA_${topicId}_${index}}}`;
            mediaFiles.push({ file, placeholder, topicId });

            // Create a new element without the buttons
            const newContainer = doc.createElement("div");
            newContainer.className = container.className;
            newContainer.appendChild(mediaElement.cloneNode(true));

            // Replace the original container with the new one
            container.parentNode?.replaceChild(newContainer, container);

            // Update the src attribute of the media element to use the placeholder
            newContainer
              .querySelector("img, video")
              ?.setAttribute("src", placeholder);
          }
        }
      });

      return doc.body.innerHTML;
    }

    function dataURLtoFile(dataurl: string, filename: string): File {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }

    const transformedRoot = populateChildren(root);

    return {
      uniqueId: newRootId,
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
      mediaFiles: mediaFiles,
    };
  }

  const handleContinue = useCallback(
    (selectedRoadmapType: string, selectedMembers: any[]) => {
      const transformedTopics: any = transformTopics(currentTopicsState.topics);
      console.log("TransformedTopics title : ", transformedTopics.title);
      console.log(
        "TransformedTopics description : ",
        transformedTopics.description
      );
      if (!transformedTopics.title || !transformedTopics.description) {
        setShowEmptyRootWarning(true);
        return;
      }
      console.log("handleContinue : ", selectedMembers);
      transformedTopics.members = selectedMembers.map((member) => member._id);
      transformedTopics.type = selectedRoadmapType;
      dispatch(setEditorData(transformedTopics));
      router.push("/create-diagram");
    },
    [currentTopicsState.topics, dispatch, router]
  );

  return (
    <>
      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
        <div
          className={`nested-note-taker rounded-lg ${
            isDarkMode ? "bg-gray-900 shadow-lg" : "bg-white shadow-sm"
          } pt-6 sm:p-6`}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              onClick={handleAddRootTopic}
              variant="outline"
              className={`w-full sm:w-auto ${isDarkMode && "text-white"}`}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Root Topic
            </Button>
            <Button
              onClick={handleEditRoot}
              variant="outline"
              className={`w-full sm:w-auto ${isDarkMode && "text-white"}`}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Root
            </Button>
            <Button
              onClick={handleResetTopics}
              variant="outline"
              className="w-full sm:w-auto dark:text-white"
            >
              <Trash className="mr-2 h-4 w-4" /> Reset
            </Button>
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

        <Dialog
          open={showEmptyRootWarning}
          onOpenChange={setShowEmptyRootWarning}
        >
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>
                <AlertCircle className="h-6 w-6 text-yellow-500 inline mr-2" />
                Empty Root Topic
              </DialogTitle>
              <DialogDescription>
                The root title and content cannot be empty. Please add a title
                and content to the root topic before submitting the roadmap.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setShowEmptyRootWarning(false)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showRootEditModal} onOpenChange={setShowRootEditModal}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Edit Root Topic</DialogTitle>
              <DialogDescription>
                Update the title and content of the root topic.
              </DialogDescription>
            </DialogHeader>
            <Input
              value={rootTitle}
              onChange={(e) => setRootTitle(e.target.value)}
              placeholder="Root Title"
              className="mb-4"
            />
            <Textarea
              value={rootContent}
              onChange={(e) => setRootContent(e.target.value)}
              placeholder="Root Content"
              rows={4}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRootEditModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveRoot}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showResetConfirmation}
          onOpenChange={setShowResetConfirmation}
        >
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Confirm Reset</DialogTitle>
              <DialogDescription>
                Are you sure you want to reset all topics? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowResetConfirmation(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmResetTopics}>
                Reset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default NestedNoteTaker;
