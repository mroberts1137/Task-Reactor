import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

const savedTasksSlice = createSlice({
  name: 'savedTasks',
  initialState: [],
  reducers: {
    saveTask(state, action) {
      console.log(action.payload);
      state.push({
        id: uuid(),
        ...action.payload
      });
    }
  }
});

export const { saveTask } = savedTasksSlice.actions;
export const selectSavedTasks = (state) => state.savedTasks;

export default savedTasksSlice.reducer;
