// topicsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TopicsState, Topic, Rect, ConnectionType } from '@/types';

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
  rectangles: [],
  connections: [],
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
    setRectangles: (state, action: PayloadAction<Rect[]>) => {
      state.rectangles = action.payload;
    },
    setConnections: (state, action: PayloadAction<ConnectionType[]>) => {
      state.connections = action.payload;
    },
    resetTopics: () => initialState,

    extraReducers: (builder) => {
      builder.addCase('IMPORT_STATE', (state, action: PayloadAction<any>) => {
        return { ...state, ...action.payload.topics };
      });
    },
  },
});

export const {
  addTopic,
  updateTopic,
  deleteTopic,
  toggleExpand,
  setRectangles,
  setConnections,
  resetTopics
} = topicsSlice.actions;

export default topicsSlice.reducer;