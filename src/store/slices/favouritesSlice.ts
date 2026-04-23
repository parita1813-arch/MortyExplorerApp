import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  deleteFavouriteCharacter,
  getFavouriteCharacters,
  initFavouritesTable,
  upsertFavouriteCharacter,
} from '../../db/favouritesDb';
import type { Character, FavouriteCharacter } from '../../types/api';

interface FavouritesState {
  items: FavouriteCharacter[];
  loading: boolean;
  error: string | null;
}

const initialState: FavouritesState = {
  items: [],
  loading: false,
  error: null,
};

/** Loads favorites from SQLite at app startup. */
export const bootstrapFavourites = createAsyncThunk('favourites/bootstrap', async () => {
  await initFavouritesTable();
  return getFavouriteCharacters();
});

/** Adds item to SQLite and syncs local store. */
export const addFavourite = createAsyncThunk(
  'favourites/add',
  async (character: Character): Promise<FavouriteCharacter> => {
    const mapped: FavouriteCharacter = {
      id: character.id,
      name: character.name,
      image: character.image,
      species: character.species,
      status: character.status,
      locationName: character.location.name,
    };
    await upsertFavouriteCharacter(mapped);
    return mapped;
  },
);

/** Removes item from SQLite and store by id. */
export const removeFavourite = createAsyncThunk('favourites/remove', async (id: number) => {
  await deleteFavouriteCharacter(id);
  return id;
});

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(bootstrapFavourites.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bootstrapFavourites.fulfilled, (state, action: PayloadAction<FavouriteCharacter[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(bootstrapFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load favourites';
      })
      .addCase(addFavourite.fulfilled, (state, action: PayloadAction<FavouriteCharacter>) => {
        const exists = state.items.some(item => item.id === action.payload.id);
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      .addCase(removeFavourite.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const favouritesReducer = favouritesSlice.reducer;
