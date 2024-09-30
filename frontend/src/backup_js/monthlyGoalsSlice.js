import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

import {
  fetchMonthlyGoals,
  addMonthlyGoal,
  getMonthlyGoalById,
  updateMonthlyGoalById,
  removeMonthlyGoalById
} from './monthlyGoalsThunks';

export {
  fetchMonthlyGoals,
  addMonthlyGoal,
  getMonthlyGoalById,
  updateMonthlyGoalById,
  removeMonthlyGoalById
};

const initialState = {
  monthlyGoalsArray: [
    { _id: uuid(), title: 'Rent', value: '500' },
    { _id: uuid(), title: 'Car Loan', value: '124' },
    { _id: uuid(), title: 'Car Insurance', value: '93' },
    { _id: uuid(), title: 'Credit Card', value: '122' },
    { _id: uuid(), title: 'Nucamp', value: '160' },
    { _id: uuid(), title: 'Phone', value: '37' },
    { _id: uuid(), title: 'Groceries', value: '413' },
    { _id: uuid(), title: 'Gas', value: '96' },
    { _id: uuid(), title: 'Restaurant/Other', value: '232' },
    { _id: uuid(), title: 'Shopping', value: '97' }
  ],
  status: 'idle',
  error: null
};

const monthlyGoalsSlice = createSlice({
  name: 'monthlyGoals',
  initialState,
  reducers: {
    setGoals: (state, action) => {
      state = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      /* 
        fetchMonthlyGoals
      */
      .addCase(fetchMonthlyGoals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMonthlyGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monthlyGoalsArray = action.payload;
      })
      .addCase(fetchMonthlyGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      /* 
        addMonthlyGoal
      */
      .addCase(addMonthlyGoal.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addMonthlyGoal.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monthlyGoalsArray.push(action.payload);
      })
      .addCase(addMonthlyGoal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      /*
        getMonthlyGoalById
      */
      .addCase(getMonthlyGoalById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getMonthlyGoalById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monthlyGoalsArray.push(action.payload);
      })
      .addCase(getMonthlyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      /*
        updateMonthlyGoalById
      */
      .addCase(updateMonthlyGoalById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateMonthlyGoalById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedMonthlyGoalIdx = state.monthlyGoalsArray.findIndex(
          (item) => item._id == action.payload._id
        );
        if (updatedMonthlyGoalIdx !== -1)
          state.monthlyGoalsArray[updatedMonthlyGoalIdx] = action.payload;
      })
      .addCase(updateMonthlyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      /* 
        removeMonthlyGoalById
      */
      .addCase(removeMonthlyGoalById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeMonthlyGoalById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monthlyGoalsArray = state.monthlyGoalsArray.filter(
          (item) => item._id !== action.payload._id
        );
      })
      .addCase(removeMonthlyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default monthlyGoalsSlice.reducer;
export const { setGoals } = monthlyGoalsSlice.actions;

export const selectAllGoals = (state) => state.monthlyGoals.monthlyGoalsArray;
