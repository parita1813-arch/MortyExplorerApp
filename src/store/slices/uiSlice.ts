import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CharacterFilters } from '../../types/api';

interface UiState {
  filters: CharacterFilters;
  activeTab: 'Characters' | 'Episodes' | 'Locations' | 'Favourites';
}

const initialState: UiState = {
  filters: {
    search: '',
    status: '',
    gender: '',
  },
  activeTab: 'Characters',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
    setStatus(state, action: PayloadAction<CharacterFilters['status']>) {
      state.filters.status = action.payload;
    },
    setGender(state, action: PayloadAction<CharacterFilters['gender']>) {
      state.filters.gender = action.payload;
    },
    setActiveTab(state, action: PayloadAction<UiState['activeTab']>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setSearch, setStatus, setGender, setActiveTab } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
