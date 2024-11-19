import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createMigrate
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './userSlice';
import tasksReducer from './tasksSlice';
import dailyGoalsReducer from './dailyGoalsSlice';
import monthlyGoalsReducer from './monthlyGoalsSlice';
import savedTasksReducer from './savedTasksSlice';

const persistConfig = {
  key: 'root',
  version: 2, // Update this when state shape changes
  storage,
  migrate: (state) => {
    // Migration logic
    return Promise.resolve(state);
  },
  whitelist: ['user', 'savedTasks']
  // migrate: createMigrate(migrations, { debug: process.env.NODE_ENV !== 'production' })
};

const rootReducer = combineReducers({
  user: userReducer,
  tasks: tasksReducer,
  dailyGoals: dailyGoalsReducer,
  monthlyGoals: monthlyGoalsReducer,
  savedTasks: savedTasksReducer
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export const persistor = persistStore(store, null, () => {
  console.log('Rehydration complete');
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
