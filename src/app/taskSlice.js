import { createSlice, createSelector } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

import { fetchTasks, addTaskAsync, removeTaskAsync } from './tasksThunks';

export { fetchTasks, addTaskAsync, removeTaskAsync };

const initialState = {
  taskArray: [],
  status: 'idle',
  error: null
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.taskArray.push({
        id: uuid(),
        ...action.payload
      });
    },
    removeTask: (state, action) => {
      state.taskArray = state.taskArray.filter(
        (task) => task.id !== action.payload.id
      );
    },
    setTasks: (state, action) => {
      state = action.payload;
    },
    reset: () => initialState
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(addTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskArray.push(action.payload);
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(removeTaskAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeTaskAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskArray = state.taskArray.filter(
          (task) => task.id !== action.payload.id
        );
      })
      .addCase(removeTaskAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default taskSlice.reducer;
export const { addTask, removeTask, setTasks, reset } = taskSlice.actions;
export const selectAllTasks = (state) => state.tasks.taskArray;

export const selectTasksByDate = createSelector(
  [(state) => state.tasks.taskArray, (state, date) => date],
  (tasks, date) => {
    return tasks.filter((item) => {
      const taskDate = new Date(item.startTime);
      return (
        taskDate instanceof Date &&
        !isNaN(taskDate) &&
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  }
);

export const selectAllTasksByMonth = createSelector(
  [(state) => state.tasks.taskArray, (state, date) => date],
  (tasks, date) => {
    return tasks.filter((item) => {
      const taskDate = new Date(item.startTime);
      return (
        taskDate instanceof Date &&
        !isNaN(taskDate) &&
        date instanceof Date &&
        !isNaN(date) &&
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth()
      );
    });
  }
);
