import { configureStore } from '@reduxjs/toolkit';
import { goalsReducer } from './goalsReducer';

export const store = configureStore({
  reducer: {
    goals: goalsReducer
  }
});
