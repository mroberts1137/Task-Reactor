import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import {
  fetchDailyGoals,
  addDailyGoal,
  getDailyGoalById,
  updateDailyGoalById,
  removeDailyGoalById
} from './dailyGoalsThunks';

const initialState = {
  dailyGoalsArray: [{ id: uuid(), title: 'Daily Minimum', value: 86 }],
  status: 'idle',
  error: null
};

const dailyGoalsSlice = createSlice({
  name: 'dailyGoals',
  initialState,
  reducers: {
    addGoal: (state, action) => {
      state.dailyGoalsArray.push({
        id: uuid(),
        title: action.payload.title,
        value: action.payload.value
      });
    },
    removeGoal: (state, action) => {
      state.dailyGoalsArray = state.dailyGoalsArray.filter(
        (goal) => goal.id !== action.payload.id
      );
    },
    setGoals: (state, action) => {
      state = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchDailyGoals
      .addCase(fetchDailyGoals.pending, (state) => {
        state.status = 'loading';
        console.log('daily goal loading');
      })
      .addCase(fetchDailyGoals.fulfilled, (state, action) => {
        console.log(`daily goal succeeded: ${action.payload}`);

        state.status = 'succeeded';
        state.dailyGoalsArray = action.payload;
      })
      .addCase(fetchDailyGoals.rejected, (state, action) => {
        console.log(`daily goal failed: ${action.error.message}`);

        state.status = 'failure';
        state.error = action.error.message;
      });
  }
});

export default dailyGoalsSlice.reducer;
export const { addGoal, removeGoal, setGoals } = dailyGoalsSlice.actions;
export const selectAllGoals = (state) => state.dailyGoals.dailyGoalsArray;
