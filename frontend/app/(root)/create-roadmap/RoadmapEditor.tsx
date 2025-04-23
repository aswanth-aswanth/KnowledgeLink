'use client';
import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Plus, Trash, Edit, AlertCircle } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { RootState, AppDispatch } from '@/redux';
import {
  addTopic,
  resetTopics,
  setEditorData,
  setRootTitleAndContent,
  reorderTopics,
  moveTopicToParent,
} from '@/redux/topicsSlice';
import ChooseRoadmapType from './ChooseRoadmapType';
import RoadmapTopicNode from './DraggableTopicItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Droppable } from 'react-beautiful-dnd';
import CustomDialog from '@/components/shared/CustomDialog';

const RoadmapEditor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rootTopic = useSelector(
    (state: RootState) => state.topics.topics[state.topics.rootId]
  );
  const [roadmapType, setRoadmapType] = useState('public_voting');
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

  const handleAddTopicToRoot = useCallback(() => {
    const newTopic = {
      id: uuid().slice(0, 13),
      name: 'New Topic',
      content: '', // Changed from empty array to empty string to match the type
      no: `${rootTopic.children.length + 1}`,
      children: [],
      isExpanded: false,
    };
    dispatch(addTopic({ parentId: rootTopic.id, newTopic }));
  }, [dispatch, rootTopic.id, rootTopic.children.length]);

  const handleResetTopics = useCallback(() => {
    setShowResetConfirmation(true);
  }, []);

  const handleConfirmReset = useCallback(() => {
    dispatch(resetTopics());
    setShowResetConfirmation(false);
    toast({
      title: 'Topics Reset',
      description: 'All topics have been reset to the initial state.',
    });
  }, [dispatch]);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      // If dropped outside a droppable area
      if (!destination) return;

      // If dropped in the same position
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      // If reordering within the same parent
      if (destination.droppableId === source.droppableId) {
        dispatch(
          reorderTopics({
            parentId: destination.droppableId,
            oldIndex: source.index,
            newIndex: destination.index,
          })
        );
        return;
      }

      // If moving to a different parent
      dispatch(
        moveTopicToParent({
          topicId: draggableId,
          oldParentId: source.droppableId,
          newParentId: destination.droppableId,
          oldIndex: source.index,
          newIndex: destination.index,
        })
      );
    },
    [dispatch]
  );

  const currentTopicsState = useSelector((state: RootState) => state.topics);

  interface MediaFile {
    file: File;
    placeholder: string;
    topicId: string;
  }

  function transformTopics(topics: any) {
    const root = topics.root;
    const newRootId = uuid().slice(0, 13);
    const mediaFiles: MediaFile[] = [];

    function populateChildren(node: any) {
      const { isExpanded, ...cleanedNode } = node;
      const topicId = uuid().slice(0, 13);

      return {
        uniqueId: topicId,
        name: cleanedNode.name,
        content: cleanedNode.content,
        tags: [],
        children: node.children.map((childId: string) => {
          const childNode = topics[childId];
          return populateChildren(childNode);
        }),
      };
    }

    function processContent(content: string, topicId: string): string {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      doc.querySelectorAll('.media-container').forEach((container, index) => {
        const mediaElement = container.querySelector('img, video');
        if (
          mediaElement instanceof HTMLImageElement ||
          mediaElement instanceof HTMLVideoElement
        ) {
          const dataUrl = mediaElement.src;
          if (dataUrl.startsWith('data:')) {
            const file = dataURLtoFile(dataUrl, `media_${topicId}_${index}`);
            const placeholder = `{{MEDIA_${topicId}_${index}}}`;
            mediaFiles.push({ file, placeholder, topicId });

            // Create a new element without the buttons
            const newContainer = doc.createElement('div');
            newContainer.className = container.className;
            newContainer.appendChild(mediaElement.cloneNode(true));

            // Replace the original container with the new one
            container.parentNode?.replaceChild(newContainer, container);

            // Update the src attribute of the media element to use the placeholder
            newContainer
              .querySelector('img, video')
              ?.setAttribute('src', placeholder);
          }
        }
      });

      return doc.body.innerHTML;
    }

    function dataURLtoFile(dataurl: string, filename: string): File {
      const arr = dataurl.split(',');
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
      creatorId: '',
      topics: transformedRoot,
      createdAt: '',
      updatedAt: '',
      id: newRootId,
      mediaFiles: mediaFiles,
    };
  }

  const handleContinue = useCallback(
    (selectedRoadmapType: string, selectedMembers: any[]) => {
      const transformedTopics: any = transformTopics(currentTopicsState.topics);

      if (!transformedTopics.title || !transformedTopics.description) {
        setShowEmptyRootWarning(true);
        return;
      }

      transformedTopics.members = selectedMembers.map(
        (member: any) => member._id
      );
      transformedTopics.type = selectedRoadmapType;
      dispatch(setEditorData(transformedTopics));
      router.push('/create-diagram');
    },
    [currentTopicsState.topics, dispatch, router]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
        <div className="nested-note-taker rounded-lg bg-white shadow-sm dark:bg-gray-900 dark:shadow-lg pt-6 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              onClick={handleAddTopicToRoot}
              variant="outline"
              className="w-full sm:w-auto dark:text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Root Topic
            </Button>
            <Button
              onClick={handleEditRoot}
              variant="outline"
              className="w-full sm:w-auto dark:text-white"
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

          <Droppable droppableId={rootTopic.id} type="root-topic-list">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="root-topic-list"
              >
                {rootTopic.children.map((childId, index) => (
                  <RoadmapTopicNode key={childId} id={childId} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className="flex justify-end py-8">
          <ChooseRoadmapType
            onContinue={handleContinue}
            roadmapType={roadmapType}
            setRoadmapType={setRoadmapType}
          />
        </div>

        <CustomDialog
          open={showEmptyRootWarning}
          onOpenChange={setShowEmptyRootWarning}
          title={
            <>
              <AlertCircle className="h-6 w-6 text-yellow-500 inline mr-2" />
              Empty Root Topic
            </>
          }
          description="The root title and content cannot be empty. Please add a title and content to the root topic before submitting the roadmap."
          footer={
            <Button onClick={() => setShowEmptyRootWarning(false)}>OK</Button>
          }
        />

        <CustomDialog
          open={showRootEditModal}
          onOpenChange={setShowRootEditModal}
          title="Edit Root Topic"
          description="Update the title and content of the root topic."
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setShowRootEditModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveRoot}>Save</Button>
            </>
          }
        >
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
        </CustomDialog>

        <CustomDialog
          open={showResetConfirmation}
          onOpenChange={setShowResetConfirmation}
          title="Confirm Reset"
          description="Are you sure you want to reset all topics? This action cannot be undone."
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setShowResetConfirmation(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmReset}>
                Reset
              </Button>
            </>
          }
        />
      </div>
    </DragDropContext>
  );
};

export default RoadmapEditor;
