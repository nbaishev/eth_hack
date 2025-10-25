import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { usersReducer } from '../features/users/usersSlice.ts';
import { glaciersReducer } from '../features/glacierGraph/glacierSlice.ts';
import { waterConsumptionReducer } from '../features/waterConsumption/waterConsumptionSlice.ts';

const usersPersistConfig = {
  key: 'glacier:users',
  storage: storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  glaciers: glaciersReducer,
  users: persistReducer(usersPersistConfig, usersReducer),
  waterConsumption: waterConsumptionReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, REHYDRATE, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
