import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi.ts';
import { Glacier } from '../../types';

// Thunk для получения данных ледников
export const fetchGlaciers = createAsyncThunk<Glacier[], void>('glacier/fetchAll', async () => {
  const glacierResponse = await axiosApi.get<Glacier[]>('/glacier');
  return glacierResponse.data;
});

// Thunk для получения данных о конкретном леднике по его ID
export const fetchGlacierById = createAsyncThunk<Glacier[], string>('glacier/fetchById', async (id: string) => {
  // Выполняем запрос с передачей ID ледника
  const glacierResponse = await axiosApi.get<Glacier[]>(`/glacier/${id}`);
  return glacierResponse.data;
});
