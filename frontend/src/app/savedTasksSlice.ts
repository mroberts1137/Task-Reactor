import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { SavedTask } from '../types/types';

const savedTasksSlice = createSlice({
  name: 'savedTasks',
  initialState: [] as SavedTask[],
  reducers: {
    saveTask: {
      reducer: (state, action: PayloadAction<SavedTask>) => {
        const existingTask = state.find((t) => t.id === action.payload.id);
        if (!existingTask) {
          state.push(action.payload);
        }
      },
      prepare: (task: Omit<SavedTask, 'id'>) => ({
        payload: { id: uuid(), ...task } as SavedTask
      })
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((task) => task.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    editTask: (state, action: PayloadAction<SavedTask>) => {
      const index = state.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    }
  }
});

export const { saveTask, deleteTask, editTask } = savedTasksSlice.actions;
export const selectSavedTasks = (state: { savedTasks: SavedTask[] }) =>
  state.savedTasks;

export default savedTasksSlice.reducer;
