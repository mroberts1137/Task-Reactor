import {
  createSlice,
  createSelector,
  createEntityAdapter,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import {
  fetchTasks,
  addTask,
  getTaskById,
  updateTaskById,
  removeTaskById
} from './tasksThunks';
import { RootState } from './store';
import { Task } from '../types/types';

export const tasksAdapter = createEntityAdapter<Task>({
  sortComparer: (a, b) => {
    if (!a.startTime || !b.startTime) return 0;
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  }
});

export interface TasksState extends EntityState<Task, string> {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const initialState: TasksState = tasksAdapter.getInitialState({
  status: 'idle',
  error: null
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      tasksAdapter.setAll(state, action.payload);
    },
    reset: () => initialState,
    clearTasks: (state) => {
      tasksAdapter.removeAll(state);
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = 'succeeded';
        state.error = null;
        tasksAdapter.setAll(state, action.payload);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching tasks';
      })
      .addCase(addTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = 'succeeded';
        state.error = null;
        tasksAdapter.addOne(state, action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error adding task';
      })
      .addCase(getTaskById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = 'succeeded';
        state.error = null;
        tasksAdapter.upsertOne(state, action.payload);
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error fetching task';
      })
      .addCase(updateTaskById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        updateTaskById.fulfilled,
        (state, action: PayloadAction<Task>) => {
          state.status = 'succeeded';
          state.error = null;
          tasksAdapter.updateOne(state, {
            id: action.payload.id,
            changes: action.payload
          });
        }
      )
      .addCase(updateTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error updating task';
      })
      .addCase(removeTaskById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        removeTaskById.fulfilled,
        (state, action: PayloadAction<Task>) => {
          state.status = 'succeeded';
          state.error = null;
          tasksAdapter.removeOne(state, action.payload.id);
        }
      )
      .addCase(removeTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error removing task';
      });
  }
});

export default tasksSlice.reducer;
export const { setTasks, reset, clearTasks } = tasksSlice.actions;

const adapterSelectors = tasksAdapter.getSelectors<RootState>(
  (state) => state.tasks
);

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds
} = adapterSelectors;

export const selectTasksByDate = createSelector(
  [selectAllTasks, (_state: RootState, date: Date | null) => date],
  (tasks, date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return [];

    return tasks.filter((item) => {
      const taskDate = new Date(item?.startTime);
      return (
        taskDate instanceof Date &&
        !isNaN(taskDate.getTime()) &&
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  }
);

export const selectAllTasksByMonth = createSelector(
  [selectAllTasks, (_state: RootState, date: Date | null) => date],
  (tasks, date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return [];

    return tasks.filter((item) => {
      const taskDate = new Date(item?.startTime);
      return (
        taskDate instanceof Date &&
        !isNaN(taskDate.getTime()) &&
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth()
      );
    });
  }
);
