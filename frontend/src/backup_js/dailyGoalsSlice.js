import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import {
  fetchDailyGoals,
  addDailyGoal,
  getDailyGoalById,
  updateDailyGoalById,
  removeDailyGoalById
} from './dailyGoalsThunks';

export {
  fetchDailyGoals,
  addDailyGoal,
  getDailyGoalById,
  updateDailyGoalById,
  removeDailyGoalById
};

const initialState = {
  dailyGoalsArray: [{ _id: uuid(), title: 'Daily Minimum', value: '86' }],
  status: 'idle',
  error: null
};

const dailyGoalsSlice = createSlice({
  name: 'dailyGoals',
  initialState,
  reducers: {
    setGoals: (state, action) => {
      state = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      /* 
        fetchDailyGoals
      */
      .addCase(fetchDailyGoals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDailyGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dailyGoalsArray = action.payload;
      })
      .addCase(fetchDailyGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      /* 
        addDailyGoal
      */
      .addCase(addDailyGoal.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addDailyGoal.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dailyGoalsArray.push(action.payload);
      })
      .addCase(addDailyGoal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      /*
          getDailyGoalById
        */
      .addCase(getDailyGoalById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDailyGoalById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dailyGoalsArray.push(action.payload);
      })
      .addCase(getDailyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      /*
          updateDailyGoalById
        */
      .addCase(updateDailyGoalById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateDailyGoalById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedDailyGoalIdx = state.dailyGoalsArray.findIndex(
          (item) => item._id == action.payload._id
        );
        if (updatedDailyGoalIdx !== -1)
          state.dailyGoalsArray[updatedDailyGoalIdx] = action.payload;
      })
      .addCase(updateDailyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      /* 
          removeDailyGoalById
        */
      .addCase(removeDailyGoalById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeDailyGoalById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dailyGoalsArray = state.dailyGoalsArray.filter(
          (item) => item._id !== action.payload._id
        );
      })
      .addCase(removeDailyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default dailyGoalsSlice.reducer;
export const { setGoals } = dailyGoalsSlice.actions;

export const selectAllGoals = (state) => state.dailyGoals.dailyGoalsArray;
