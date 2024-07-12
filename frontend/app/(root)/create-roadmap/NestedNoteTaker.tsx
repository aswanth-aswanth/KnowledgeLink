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
      transformedTopics.members = selectedMembers.map((member) => member.email);
      transformedTopics.type = selectedRoadmapType;
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
          <Button
            onClick={handleAddRootTopic}
            variant="outline"
            className={`${isDarkMode && "text-white"}`}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Root Topic
          </Button>
          <Button
            onClick={handleEditRoot}
            variant="outline"
            className={`${isDarkMode && "text-white"}`}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Root
          </Button>
          <Button onClick={handleResetTopics} variant="destructive">
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
              The root title and content cannot be empty. Please add a title and
              content to the root topic before submitting the roadmap.
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
    </>
  );
};

export default NestedNoteTaker;
