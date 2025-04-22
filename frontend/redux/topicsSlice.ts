import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TopicsState, Topic } from '@/types';

const initialState: TopicsState = {
  topics: {
    root: {
      id: 'root',
      name: 'Root',
      content: '',
      no: '0',
      children: [],
      isExpanded: true,
    },
  },
  rootId: 'root',
  editorData: null,
};

const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    addTopic: (
      state,
      action: PayloadAction<{ parentId: string; newTopic: Topic }>
    ) => {
      const { parentId, newTopic } = action.payload;
      state.topics[newTopic.id] = newTopic;
      state.topics[parentId].children.push(newTopic.id);

      // Update the 'no' field
      if (parentId === state.rootId) {
        newTopic.no = `${state.topics[parentId].children.length}`;
      } else {
        const parentNo = state.topics[parentId].no;
        newTopic.no = `${parentNo}-${state.topics[parentId].children.length}`;
      }
    },
    updateTopic: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Topic> }>
    ) => {
      const { id, updates } = action.payload;
      state.topics[id] = { ...state.topics[id], ...updates };
    },
    deleteTopic: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const deleteRecursive = (topicId: string) => {
        const topic = state.topics[topicId];
        topic.children.forEach(deleteRecursive);
        delete state.topics[topicId];
      };

      const parentId = Object.keys(state.topics).find((key) =>
        state.topics[key].children.includes(id)
      );

      if (parentId) {
        state.topics[parentId].children = state.topics[
          parentId
        ].children.filter((childId) => childId !== id);
      }

      deleteRecursive(id);
    },
    toggleExpand: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.topics[id].isExpanded = !state.topics[id].isExpanded;
    },
    setEditorData: (state, action: PayloadAction<any>) => {
      state.editorData = action.payload;
    },
    setRootTitleAndContent: (
      state,
      action: PayloadAction<{ title: string; content: string }>
    ) => {
      const { title, content } = action.payload;
      state.topics[state.rootId].name = title;
      state.topics[state.rootId].content = content;
    },
    reorderTopics: (
      state,
      action: PayloadAction<{
        parentId: string;
        oldIndex: number;
        newIndex: number;
      }>
    ) => {
      const { parentId, oldIndex, newIndex } = action.payload;
      const parent = state.topics[parentId];
      const children = Array.from(parent.children);
      const [movedTopic] = children.splice(oldIndex, 1);
      children.splice(newIndex, 0, movedTopic);
      parent.children = children;

      // Update the 'no' field for reordered items
      updateTopicNumbers(state, parentId);
    },
    moveTopicToParent: (
      state,
      action: PayloadAction<{
        topicId: string;
        oldParentId: string;
        newParentId: string;
        oldIndex: number;
        newIndex: number;
      }>
    ) => {
      const { topicId, oldParentId, newParentId, oldIndex, newIndex } =
        action.payload;

      // Remove from old parent
      const oldParent = state.topics[oldParentId];
      oldParent.children.splice(oldIndex, 1);

      // Add to new parent
      const newParent = state.topics[newParentId];
      newParent.children.splice(newIndex, 0, topicId);

      // Update topic numbers for both parents
      updateTopicNumbers(state, oldParentId);
      updateTopicNumbers(state, newParentId);
    },
    resetTopics: () => initialState,
  },
});

// Helper function to update topic numbers recursively
function updateTopicNumbers(state: TopicsState, parentId: string) {
  const parent = state.topics[parentId];
  parent.children.forEach((childId, index) => {
    const child = state.topics[childId];
    if (parentId === state.rootId) {
      child.no = `${index + 1}`;
    } else {
      child.no = `${parent.no}-${index + 1}`;
    }

    // Recursively update subtopics
    if (child.children.length > 0) {
      updateTopicNumbers(state, childId);
    }
  });
}

export const {
  addTopic,
  updateTopic,
  deleteTopic,
  toggleExpand,
  resetTopics,
  setEditorData,
  setRootTitleAndContent,
  reorderTopics,
  moveTopicToParent,
} = topicsSlice.actions;

export default topicsSlice.reducer;
