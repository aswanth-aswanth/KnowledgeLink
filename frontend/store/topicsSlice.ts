import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TopicsState, Topic } from '@/types';

const initialState: TopicsState = {
  topics: {
    'root': {
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
    addTopic: (state, action: PayloadAction<{ parentId: string; newTopic: Topic }>) => {
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
    updateTopic: (state, action: PayloadAction<{ id: string; updates: Partial<Topic> }>) => {
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

      const parentId = Object.keys(state.topics).find(key =>
        state.topics[key].children.includes(id)
      );

      if (parentId) {
        state.topics[parentId].children = state.topics[parentId].children.filter(childId => childId !== id);
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
    setRootTitleAndContent: (state, action: PayloadAction<{ title: string; content: string }>) => {
      const { title, content } = action.payload;
      state.topics[state.rootId].name = title;
      state.topics[state.rootId].content = content;
    },
    resetTopics: () => initialState,
  },
});

export const { addTopic, updateTopic, deleteTopic, toggleExpand, resetTopics, setEditorData, setRootTitleAndContent } = topicsSlice.actions;
export default topicsSlice.reducer;