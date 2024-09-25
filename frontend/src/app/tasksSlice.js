import { createSlice, createSelector } from '@reduxjs/toolkit';

import {
  fetchTasks,
  addTask,
  getTaskById,
  updateTaskById,
  removeTaskById
} from './tasksThunks';
export { fetchTasks, addTask, getTaskById, updateTaskById, removeTaskById };

export const initialState = {
  taskArray: [],
  status: 'idle',
  error: null
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state = action.payload;
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
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskArray = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      /* 
        addTask
      */
      .addCase(addTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskArray.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      /*
        getTaskById
      */
      .addCase(getTaskById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskArray.push(action.payload);
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      /*
        updateTaskById
      */
      .addCase(updateTaskById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTaskById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedTaskIdx = state.taskArray.findIndex(
          (item) => item.id == action.payload.id
        );
        if (updatedTaskIdx !== -1)
          state.taskArray[updatedTaskIdx] = action.payload.id;
      })
      .addCase(updateTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      /* 
        removeTaskById
      */
      .addCase(removeTaskById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeTaskById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskArray = state.taskArray.filter(
          (item) => item.id !== action.payload.id
        );
      })
      .addCase(removeTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default tasksSlice.reducer;
export const { setTasks, reset } = tasksSlice.actions;

// Selectors

const filterTasksByDate = (tasks, date) => {
  if (!date instanceof Date || isNaN(date)) return;

  return tasks.filter((item) => {
    const taskDate = new Date(item?.startTime);
    return (
      taskDate instanceof Date &&
      !isNaN(taskDate) &&
      taskDate.getFullYear() === date.getFullYear() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getDate() === date.getDate()
    );
  });
};

const filterTasksByMonth = (tasks, date) => {
  if (!date instanceof Date || isNaN(date)) return;

  return tasks.filter((item) => {
    const taskDate = new Date(item?.startTime);
    return (
      taskDate instanceof Date &&
      !isNaN(taskDate) &&
      taskDate.getFullYear() === date.getFullYear() &&
      taskDate.getMonth() === date.getMonth()
    );
  });
};

export const selectAllTasks = (state) => state.tasks.taskArray;
export const selectTasksByDate = createSelector(
  [selectAllTasks, (state, date) => date],
  filterTasksByDate
);
export const selectAllTasksByMonth = createSelector(
  [selectAllTasks, (state, date) => date],
  filterTasksByMonth
);
