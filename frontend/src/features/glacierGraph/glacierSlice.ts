import { Glacier } from '../../types';
import { fetchGlacierById, fetchGlaciers } from './glacierThunks.ts';
import { RootState } from '../../app/store.ts';
import { createSlice } from '@reduxjs/toolkit';

interface GlacierState {
  glaciers: Glacier[];
  current: Glacier[];
  fetchLoading: boolean;
  fetchOneGlacierLoading: boolean;
}

const initialState: GlacierState = {
  glaciers: [],
  current: [],
  fetchLoading: false,
  fetchOneGlacierLoading: false,
};

export const glaciersSlice = createSlice({
  name: 'glaciers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGlaciers.pending, (state) => {
      state.fetchLoading = true;
    });
    builder.addCase(fetchGlaciers.fulfilled, (state, { payload: glaciers }) => {
      state.fetchLoading = false;
      state.glaciers = glaciers;
    });
    builder.addCase(fetchGlaciers.rejected, (state) => {
      state.fetchLoading = false;
    });
    // Загрузка конкретного ледника по ID
    builder.addCase(fetchGlacierById.pending, (state) => {
      state.fetchOneGlacierLoading = true;
    });
    builder.addCase(fetchGlacierById.fulfilled, (state, { payload: glacier }) => {
      state.fetchOneGlacierLoading = false;
      state.current = glacier; // Сохраняем конкретный ледник в состояние
    });
    builder.addCase(fetchGlacierById.rejected, (state) => {
      state.fetchOneGlacierLoading = false;
    });
  },
});

export const glaciersReducer = glaciersSlice.reducer;

export const selectGlacier = (state: RootState) => state.glaciers.glaciers; // Проверка через опциональную цепочку
export const selectGlacierLoading = (state: RootState) => state.glaciers.fetchLoading; // Гарантия, что будет возвращено булевое значение
export const selectOneGlacier = (state: RootState) => state.glaciers.current;
export const selectOneGlacierLoading = (state: RootState) => state.glaciers.fetchOneGlacierLoading;
