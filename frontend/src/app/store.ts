import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
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

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Create typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
