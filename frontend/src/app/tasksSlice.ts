import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchTasks,
  addTask,
  getTaskById,
  updateTaskById,
  removeTaskById
} from './tasksThunks';
import { RootState } from './store';
import { Task } from '../types/types';

export { fetchTasks, addTask, getTaskById, updateTaskById, removeTaskById };

export interface TasksState {
  taskArray: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const initialState: TasksState = {
  taskArray: [],
  status: 'idle',
  error: null
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.taskArray = action.payload;
    },
    reset: () => initialState
  },
  extraReducers: (builder) => {
    builder
      /* 
        fetchTasks
      */
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = 'succeeded';
        state.taskArray = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      /* 
        addTask
      */
      .addCase(addTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = 'succeeded';
        state.taskArray.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      /*
        getTaskById
      */
      .addCase(getTaskById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = 'succeeded';
        state.taskArray.push(action.payload);
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      /*
        updateTaskById
      */
      .addCase(updateTaskById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        updateTaskById.fulfilled,
        (state, action: PayloadAction<Task>) => {
          state.status = 'succeeded';
          const updatedTaskIdx = state.taskArray.findIndex(
            (item) => item.id === action.payload.id
          );
          if (updatedTaskIdx !== -1)
            state.taskArray[updatedTaskIdx] = action.payload;
        }
      )
      .addCase(updateTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      /* 
        removeTaskById
      */
      .addCase(removeTaskById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        removeTaskById.fulfilled,
        (state, action: PayloadAction<{ id: string }>) => {
          state.status = 'succeeded';
          state.taskArray = state.taskArray.filter(
            (item) => item.id !== action.payload.id
          );
        }
      )
      .addCase(removeTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  }
});

// Export slice reducer and actions
export default tasksSlice.reducer;
export const { setTasks, reset } = tasksSlice.actions;

// Selectors
const filterTasksByDate = (tasks: Task[], date: Date | null) => {
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
};

const filterTasksByMonth = (tasks: Task[], date: Date | null) => {
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
};

export const selectAllTasks = (state: RootState) => state.tasks.taskArray;
export const selectTasksByDate = createSelector(
  [selectAllTasks, (_state: RootState, date: Date | null) => date],
  filterTasksByDate
);
export const selectAllTasksByMonth = createSelector(
  [selectAllTasks, (_state: RootState, date: Date | null) => date],
  filterTasksByMonth
);
