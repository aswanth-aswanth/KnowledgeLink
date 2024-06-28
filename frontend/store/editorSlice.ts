// editorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorState {
  svgHeight: number;
  isMultiSelectMode: boolean;
  circlesVisible: boolean;
}

const initialState: EditorState = {
  svgHeight: 600,
  isMultiSelectMode: false,
  circlesVisible: true,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setSvgHeight: (state, action: PayloadAction<number>) => {
      state.svgHeight = action.payload;
    },
    setMultiSelectMode: (state, action: PayloadAction<boolean>) => {
      state.isMultiSelectMode = action.payload;
    },
    setCirclesVisible: (state, action: PayloadAction<boolean>) => {
      state.circlesVisible = action.payload;
    },
    resetEditor: () => initialState,
    extraReducers: (builder) => {
      builder.addCase('IMPORT_STATE', (state, action: PayloadAction<any>) => {
        return { ...state, ...action.payload.editor };
      });
    },
  },
});

export const {
  setSvgHeight,
  setMultiSelectMode,
  setCirclesVisible,
  resetEditor
} = editorSlice.actions;

export default editorSlice.reducer;