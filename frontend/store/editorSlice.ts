import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Rect, ConnectionType } from '@/types/EditorTypes';

interface EditorState {
  rectangles: Rect[];
  connections: ConnectionType[];
  selectedRect: string | null;
  currentLineStyle: "straight" | "curved";
  isConnectingMode: boolean;
  isMultiSelectMode: boolean;
  circlesVisible: boolean;
  scale: number;
}

const initialState: EditorState = {
  rectangles: [],
  connections: [],
  selectedRect: null,
  currentLineStyle: "straight",
  isConnectingMode: false,
  isMultiSelectMode: false,
  circlesVisible: true,
  scale: 1,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setRectangles: (state, action: PayloadAction<Rect[]>) => {
      state.rectangles = action.payload;
    },
    setConnections: (state, action: PayloadAction<ConnectionType[]>) => {
      state.connections = action.payload;
    },
    setSelectedRect: (state, action: PayloadAction<string | null>) => {
      state.selectedRect = action.payload;
    },
    setCurrentLineStyle: (state, action: PayloadAction<"straight" | "curved">) => {
      state.currentLineStyle = action.payload;
    },
    setIsConnectingMode: (state, action: PayloadAction<boolean>) => {
      state.isConnectingMode = action.payload;
    },
    setIsMultiSelectMode: (state, action: PayloadAction<boolean>) => {
      state.isMultiSelectMode = action.payload;
    },
    setCirclesVisible: (state, action: PayloadAction<boolean>) => {
      state.circlesVisible = action.payload;
    },
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
    updateRectPosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const { id, x, y } = action.payload;
      const rectIndex = state.rectangles.findIndex(rect => rect.id === id);
      if (rectIndex !== -1) {
        state.rectangles[rectIndex].x = x;
        state.rectangles[rectIndex].y = y;
      }
    },
    updateRectSize: (state, action: PayloadAction<{ id: string; width: number; height: number }>) => {
      const { id, width, height } = action.payload;
      const rectIndex = state.rectangles.findIndex(rect => rect.id === id);
      if (rectIndex !== -1) {
        state.rectangles[rectIndex].width = width;
        state.rectangles[rectIndex].height = height;
      }
    },
    deleteRect: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.rectangles = state.rectangles.filter(rect => rect.id !== id);
      state.connections = state.connections.filter(conn => conn.from !== id && conn.to !== id);
    },
    addConnection: (state, action: PayloadAction<ConnectionType>) => {
      state.connections.push(action.payload);
    },
    deleteConnection: (state, action: PayloadAction<number>) => {
      state.connections.splice(action.payload, 1);
    },
    updateConnectionStyle: (state, action: PayloadAction<{ index: number; style: "straight" | "curved" }>) => {
      const { index, style } = action.payload;
      if (index >= 0 && index < state.connections.length) {
        state.connections[index].style = style;
      }
    },
  },
});

export const {
  setRectangles,
  setConnections,
  setSelectedRect,
  setCurrentLineStyle,
  setIsConnectingMode,
  setIsMultiSelectMode,
  setCirclesVisible,
  setScale,
  updateRectPosition,
  updateRectSize,
  deleteRect,
  addConnection,
  deleteConnection,
  updateConnectionStyle,
} = editorSlice.actions;

export default editorSlice.reducer;