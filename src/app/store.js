import { configureStore } from '@reduxjs/toolkit';
import { goalsReducer } from './goalsReducer';
import { taskReducer } from './taskReducer';

export const store = configureStore({
  reducer: {
    goals: goalsReducer,
    tasks: taskReducer
  }
});
