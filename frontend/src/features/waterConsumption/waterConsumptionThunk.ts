import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi.ts';
import { WaterConsumption, WaterConsumptionMutation } from '../../types';

export const createWaterConsumption = createAsyncThunk<void, WaterConsumptionMutation>(
  'waterConsumption/create',
  async (waterConsumptionMutation) => {
    await axiosApi.post('/waterConsumption', waterConsumptionMutation);
  },
);

export const fetchWaterConsumption = createAsyncThunk<WaterConsumption[]>('waterConsumption/fetchAll', async () => {
  const waterConsumptionResponse = await axiosApi.get<WaterConsumption[]>('/waterConsumption');
  return waterConsumptionResponse.data;
});

export const fetchOneWaterConsumption = createAsyncThunk<WaterConsumption, string>(
  'WaterConsumption/fetchOne',
  async (id) => {
    const waterConsumption = await axiosApi.get<WaterConsumption>(`/waterConsumption/${id}`);
    return waterConsumption.data;
  },
);

export const updateWaterConsumption = createAsyncThunk<void, { id: string; data: WaterConsumptionMutation }>(
  'waterConsumption/update',
  async ({ id, data }) => {
    await axiosApi.patch(`/waterConsumption/${id}`, data);
  },
);

export const deleteWaterConsumption = createAsyncThunk<void, string>('waterConsumption/delete', async (id) => {
  await axiosApi.delete(`/waterConsumption/${id}`);
});
