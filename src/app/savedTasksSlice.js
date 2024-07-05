import { createSlice } from '@reduxjs/toolkit';

const savedTasksSlice = createSlice({
  name: 'savedTasks',
  initialState: [],
  reducers: {
    //1. Add a reducer to add a new task to the state
    saveTask(state, action) {
      console.log(action.payload);
      state.push({
        id: Math.random().toString(), // Generate a unique ID for the task
        ...action.payload
      });
    }
  }
});

export const { saveTask } = savedTasksSlice.actions;
export const selectSavedTasks = (state) => state.savedTasks;

export default savedTasksSlice.reducer;
