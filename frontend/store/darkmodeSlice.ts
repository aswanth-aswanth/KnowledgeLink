import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DarkModeState {
    isDarkMode: boolean;
}

const initialState: DarkModeState = {
    isDarkMode: false,
};

const darkmodeSlice = createSlice({
    name: 'darkmode',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode;
        },
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.isDarkMode = action.payload;
        },
    },
});

export const { toggleDarkMode, setDarkMode } = darkmodeSlice.actions;
export default darkmodeSlice.reducer;