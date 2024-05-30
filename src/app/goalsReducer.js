import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

const initialState = {
  goalsArray: [
    { id: uuid(), title: 'goal 1', value: 80 },
    { id: uuid(), title: 'goal 2', value: 90 },
    { id: uuid(), title: 'goal 3', value: 100 }
  ]
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action) => {
      state.goalsArray.push({
        id: uuid(),
        title: action.payload.title,
        value: action.payload.value
      });
    },
    removeGoal: (state, action) => {
      state.goalsArray = state.goalsArray.filter(
        (goal) => goal.id !== action.payload.id
      );
    },
    setGoals: (state, action) => {
      state = action.payload;
    }
  }
});

export const goalsReducer = goalsSlice.reducer;
export const { addGoal, removeGoal, setGoals } = goalsSlice.actions;
export const selectAllGoals = (state) => state.goals.goalsArray;
