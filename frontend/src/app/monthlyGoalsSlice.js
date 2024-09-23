import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

import {
  fetchMonthlyGoals,
  addMonthlyGoal,
  getMonthlyGoalById,
  updateMonthlyGoalById,
  removeMonthlyGoalById
} from './monthlyGoalsThunks';

const initialState = {
  monthlyGoalsArray: [
    { id: uuid(), title: 'Rent', value: 500 },
    { id: uuid(), title: 'Car Loan', value: 124 },
    { id: uuid(), title: 'Car Insurance', value: 93 },
    { id: uuid(), title: 'Credit Card', value: 122 },
    { id: uuid(), title: 'Nucamp', value: 160 },
    { id: uuid(), title: 'Phone', value: 37 },
    { id: uuid(), title: 'Groceries', value: 413 },
    { id: uuid(), title: 'Gas', value: 96 },
    { id: uuid(), title: 'Restaurant/Other', value: 232 },
    { id: uuid(), title: 'Shopping', value: 97 }
  ],
  status: 'idle',
  error: null
};

const monthlyGoalsSlice = createSlice({
  name: 'monthlyGoals',
  initialState,
  reducers: {
    addGoal: (state, action) => {
      state.monthlyGoalsArray.push({
        id: uuid(),
        title: action.payload.title,
        value: action.payload.value
      });
    },
    removeGoal: (state, action) => {
      state.monthlyGoalsArray = state.monthlyGoalsArray.filter(
        (goal) => goal.id !== action.payload.id
      );
    },
    setGoals: (state, action) => {
      state = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchMonthlyGoals
      .addCase(fetchMonthlyGoals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMonthlyGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monthlyGoalsArray = action.payload;
      })
      .addCase(fetchMonthlyGoals.rejected, (state, action) => {
        state.status = 'failure';
        state.error = action.error.message;
      });
  }
});

export default monthlyGoalsSlice.reducer;
export const { addGoal, removeGoal, setGoals } = monthlyGoalsSlice.actions;
export const selectAllGoals = (state) => state.monthlyGoals.monthlyGoalsArray;
