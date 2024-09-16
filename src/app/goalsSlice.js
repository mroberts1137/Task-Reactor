import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

const initialState = {
  goalsArray: [
    { id: uuid(), title: 'Car Loan', value: 124 },
    { id: uuid(), title: 'Car Insurance', value: 93 },
    { id: uuid(), title: 'Credit Card', value: 122 },
    { id: uuid(), title: 'Nucamp', value: 160 },
    { id: uuid(), title: 'Phone', value: 37 },
    { id: uuid(), title: 'Groceries', value: 413 },
    { id: uuid(), title: 'Gas', value: 96 },
    { id: uuid(), title: 'Restaurant/Other', value: 232 },
    { id: uuid(), title: 'Shopping', value: 97 }
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
