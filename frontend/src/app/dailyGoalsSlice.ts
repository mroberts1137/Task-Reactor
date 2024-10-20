import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import {
  fetchDailyGoals,
  addDailyGoal,
  getDailyGoalById,
  updateDailyGoalById,
  removeDailyGoalById
} from './dailyGoalsThunks';
import { RootState } from './store';
import { Goal } from '../types/types';

export {
  fetchDailyGoals,
  addDailyGoal,
  getDailyGoalById,
  updateDailyGoalById,
  removeDailyGoalById
};

export interface GoalsState {
  dailyGoalsArray: Goal[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: GoalsState = {
  dailyGoalsArray: [{ _id: uuid(), title: 'Daily Minimum', value: 86 }],
  status: 'idle',
  error: null
};

const dailyGoalsSlice = createSlice({
  name: 'dailyGoals',
  initialState,
  reducers: {
    setGoals: (state, action) => {
      state = action.payload;
    },
    clearDailyGoals: (state) => {
      state.dailyGoalsArray = [];
      state.status = 'idle';
      state.error = null;
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
      .addCase(
        fetchDailyGoals.fulfilled,
        (state, action: PayloadAction<Goal[]>) => {
          state.status = 'succeeded';
          state.dailyGoalsArray = action.payload;
        }
      )
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
      .addCase(addDailyGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
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
      .addCase(
        getDailyGoalById.fulfilled,
        (state, action: PayloadAction<Goal>) => {
          state.status = 'succeeded';
          state.dailyGoalsArray.push(action.payload);
        }
      )
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
      .addCase(
        updateDailyGoalById.fulfilled,
        (state, action: PayloadAction<Goal>) => {
          state.status = 'succeeded';
          const updatedDailyGoalIdx = state.dailyGoalsArray.findIndex(
            (item) => item._id === action.payload._id
          );
          if (updatedDailyGoalIdx !== -1)
            state.dailyGoalsArray[updatedDailyGoalIdx] = action.payload;
        }
      )
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
      .addCase(
        removeDailyGoalById.fulfilled,
        (state, action: PayloadAction<Goal>) => {
          state.status = 'succeeded';
          state.dailyGoalsArray = state.dailyGoalsArray.filter(
            (item) => item._id !== action.payload._id
          );
        }
      )
      .addCase(removeDailyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default dailyGoalsSlice.reducer;
export const { setGoals, clearDailyGoals } = dailyGoalsSlice.actions;

export const selectAllGoals = (state: RootState) =>
  state.dailyGoals.dailyGoalsArray;
