import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

const initialState = {
  taskArray: []
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.taskArray.push({
        id: uuid(),
        title: action.payload.title,
        value: action.payload.value,
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
        duration: action.payload.duration,
        rate: action.payload.rate
      });
    },
    removeTask: (state, action) => {
      state.taskArray = state.taskArray.filter(
        (task) => task.id !== action.payload.id
      );
    }
  }
});

export const taskReducer = taskSlice.reducer;
export const { addTask, removeTask } = taskSlice.actions;
export const selectAllTasks = (state) => state.tasks.taskArray;
