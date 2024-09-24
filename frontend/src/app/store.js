import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './userSlice';
import tasksReducer from './tasksSlice';
import dailyGoalsReducer from './dailyGoalsSlice';
import monthlyGoalsReducer from './monthlyGoalsSlice';
import savedTasksReducer from './savedTasksSlice';

const persistConfig = {
  key: 'root',
  storage
};

// storage.removeItem('persist:root');

const rootReducer = combineReducers({
  user: userReducer,
  tasks: tasksReducer,
  dailyGoals: dailyGoalsReducer,
  monthlyGoals: monthlyGoalsReducer,
  savedTasks: savedTasksReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);
