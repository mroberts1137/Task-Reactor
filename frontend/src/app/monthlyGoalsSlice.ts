import {
  createSlice,
  createEntityAdapter,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import {
  fetchMonthlyGoals,
  addMonthlyGoal,
  getMonthlyGoalById,
  updateMonthlyGoalById,
  removeMonthlyGoalById
} from './monthlyGoalsThunks';
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

const monthlyGoalsSlice = createSlice({
  name: 'monthlyGoals',
  initialState,
  reducers: {
    setGoals: (state, action: PayloadAction<Goal[]>) => {
      goalsAdapter.setAll(state, action.payload);
    },
    reset: () => initialState,
    clearMonthlyGoals: (state) => {
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
        fetchMonthlyGoals
      */
      .addCase(fetchMonthlyGoals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchMonthlyGoals.fulfilled,
        (state, action: PayloadAction<Goal[]>) => {
          state.status = 'succeeded';
          state.error = null;
          goalsAdapter.setAll(state, action.payload);
        }
      )
      .addCase(fetchMonthlyGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching monthly goals';
      })
      /* 
        addMonthlyGoal
      */
      .addCase(addMonthlyGoal.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        addMonthlyGoal.fulfilled,
        (state, action: PayloadAction<Goal>) => {
          state.status = 'succeeded';
          state.error = null;
          goalsAdapter.addOne(state, action.payload);
        }
      )
      .addCase(addMonthlyGoal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error adding monthly goal';
      })
      /*
        getMonthlyGoalById
      */
      .addCase(getMonthlyGoalById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        getMonthlyGoalById.fulfilled,
        (state, action: PayloadAction<Goal>) => {
          state.status = 'succeeded';
          state.error = null;
          goalsAdapter.upsertOne(state, action.payload);
        }
      )
      .addCase(getMonthlyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching monthly goal';
      })
      /*
        updateMonthlyGoalById
      */
      .addCase(updateMonthlyGoalById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        updateMonthlyGoalById.fulfilled,
        (state, action: PayloadAction<Goal>) => {
          state.status = 'succeeded';
          state.error = null;
          goalsAdapter.updateOne(state, {
            id: action.payload.id,
            changes: action.payload
          });
        }
      )
      .addCase(updateMonthlyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error updating monthly goal';
      })
      /* 
        removeMonthlyGoalById
      */
      .addCase(removeMonthlyGoalById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        removeMonthlyGoalById.fulfilled,
        (state, action: PayloadAction<Goal>) => {
          state.status = 'succeeded';
          state.error = null;
          goalsAdapter.removeOne(state, action.payload.id);
        }
      )
      .addCase(removeMonthlyGoalById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error removing monthly goal';
      });
  }
});

export default monthlyGoalsSlice.reducer;
export const { setGoals, clearMonthlyGoals, reorderGoals, reset } =
  monthlyGoalsSlice.actions;

const adapterSelectors = goalsAdapter.getSelectors<RootState>(
  (state) => state.monthlyGoals
);

export const {
  selectAll: selectAllMonthlyGoals,
  selectById: selectMonthlyGoalById,
  selectIds: selectMonthlyGoalIds
} = adapterSelectors;
