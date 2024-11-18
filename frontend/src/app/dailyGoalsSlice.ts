import {
  createSlice,
  createEntityAdapter,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import {
  fetchDailyGoals,
  addDailyGoal,
  getDailyGoalById,
  updateDailyGoalById,
  removeDailyGoalById
} from './dailyGoalsThunks';
import { RootState } from './store';
import { Goal } from '../types/types';

export const goalsAdapter = createEntityAdapter<Goal>();

export interface GoalsState extends EntityState<Goal, string> {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const initialState: GoalsState = goalsAdapter.getInitialState({
  status: 'idle',
  error: null
});

const dailyGoalsSlice = createSlice({
  name: 'dailyGoals',
  initialState,
  reducers: {
    setGoals: (state, action: PayloadAction<Goal[]>) => {
      goalsAdapter.setAll(state, action.payload);
    },
    reset: () => initialState,
    clearDailyGoals: (state) => {
      goalsAdapter.removeAll(state);
      state.status = 'idle';
      state.error = null;
    },
    reorderGoals: (state, action) => {
      state.ids = action.payload;
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
          goalsAdapter.setAll(state, action.payload);
        }
      )
      .addCase(fetchDailyGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching daily goals';
      })
      /* 
        addDailyGoal
      */
      .addCase(addDailyGoal.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addDailyGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.status = 'succeeded';
        goalsAdapter.addOne(state, action.payload);
      })
      .addCase(addDailyGoal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error adding daily goal';
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
          goalsAdapter.upsertOne(state, action.payload);
        }
      )
      .addCase(getDailyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching daily goal';
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
          goalsAdapter.updateOne(state, {
            id: action.payload.id!,
            changes: action.payload
          });
        }
      )
      .addCase(updateDailyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error updating daily goal';
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
          goalsAdapter.removeOne(state, action.payload.id!);
        }
      )
      .addCase(removeDailyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error removing daily goal';
      });
  }
});

export default dailyGoalsSlice.reducer;
export const { setGoals, clearDailyGoals, reorderGoals, reset } =
  dailyGoalsSlice.actions;

const adapterSelectors = goalsAdapter.getSelectors<RootState>(
  (state) => state.dailyGoals
);

export const {
  selectAll: selectAllDailyGoals,
  selectById: selectDailyGoalById,
  selectIds: selectDailyGoalIds
} = adapterSelectors;
