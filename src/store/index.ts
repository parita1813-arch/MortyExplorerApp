import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { favouritesReducer } from './slices/favouritesSlice';
import { uiReducer } from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    favourites: favouritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/** Typed dispatch hook for all async actions. */
export const useAppDispatch = () => useDispatch<AppDispatch>();
/** Typed selector hook to avoid repetitive RootState imports. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
