import { WaterConsumption } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  createWaterConsumption,
  deleteWaterConsumption,
  fetchOneWaterConsumption,
  fetchWaterConsumption,
  updateWaterConsumption,
} from './waterConsumptionThunk.ts';

interface WaterConsumptionState {
  items: WaterConsumption[];
  current: WaterConsumption | null;
  fetchLoading: boolean;
  createLoading: boolean;
  fetchOneLoading: boolean;
  deleteLoading: boolean;
  updateLoading: boolean;
}

const initialState: WaterConsumptionState = {
  items: [],
  current: null,
  fetchLoading: false,
  createLoading: false,
  fetchOneLoading: false,
  deleteLoading: false,
  updateLoading: false, // инициализация флага
};

export const waterConsumptionSlice = createSlice({
  name: 'waterConsumption',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWaterConsumption.pending, (state) => {
      state.fetchLoading = true;
    });
    builder.addCase(fetchWaterConsumption.fulfilled, (state, { payload: waterConsumption }) => {
      state.fetchLoading = false;
      state.items = waterConsumption;
    });
    builder.addCase(fetchWaterConsumption.rejected, (state) => {
      state.fetchLoading = false;
    });

    builder.addCase(createWaterConsumption.pending, (state) => {
      state.createLoading = true;
    });
    builder.addCase(createWaterConsumption.fulfilled, (state) => {
      state.createLoading = false;
    });
    builder.addCase(createWaterConsumption.rejected, (state) => {
      state.createLoading = false;
    });

    builder.addCase(fetchOneWaterConsumption.pending, (state) => {
      state.fetchOneLoading = true;
    });
    builder.addCase(fetchOneWaterConsumption.fulfilled, (state, { payload: waterConsumption }) => {
      state.fetchOneLoading = false;
      state.current = waterConsumption;
    });
    builder.addCase(fetchOneWaterConsumption.rejected, (state) => {
      state.fetchOneLoading = false;
    });

    builder.addCase(updateWaterConsumption.pending, (state) => {
      state.updateLoading = true;
    });
    builder.addCase(updateWaterConsumption.fulfilled, (state) => {
      state.updateLoading = false;
    });
    builder.addCase(updateWaterConsumption.rejected, (state) => {
      state.updateLoading = false;
    });

    builder.addCase(deleteWaterConsumption.pending, (state) => {
      state.deleteLoading = true;
    });
    builder.addCase(deleteWaterConsumption.fulfilled, (state) => {
      state.deleteLoading = false;
    });
    builder.addCase(deleteWaterConsumption.rejected, (state) => {
      state.deleteLoading = false;
    });
  },
});

export const waterConsumptionReducer = waterConsumptionSlice.reducer;

export const selectWaterConsumption = (state: RootState) => state.waterConsumption.items;
export const selectWaterConsumptionLoading = (state: RootState) => state.waterConsumption.fetchLoading;
export const selectWaterConsumptionCreating = (state: RootState) => state.waterConsumption.createLoading;
export const selectOneWaterConsumption = (state: RootState) => state.waterConsumption.current;
export const selectOneWaterConsumptionLoading = (state: RootState) => state.waterConsumption.fetchOneLoading;
export const selectWaterConsumptionDeleteLoading = (state: RootState) => state.waterConsumption.deleteLoading;
export const selectWaterConsumptionUpdateLoading = (state: RootState) => state.waterConsumption.updateLoading;
