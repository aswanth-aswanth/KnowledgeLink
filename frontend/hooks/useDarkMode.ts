import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleDarkMode, setDarkMode } from '@/store/darkmodeSlice';

export const useDarkMode = () => {
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state: RootState) => state.darkmode.isDarkMode);

    const toggleDarkModeHandler = () => dispatch(toggleDarkMode());
    const setDarkModeHandler = (value: boolean) => dispatch(setDarkMode(value));

    return { isDarkMode, toggleDarkMode: toggleDarkModeHandler, setDarkMode: setDarkModeHandler };
};