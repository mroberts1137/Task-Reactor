import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

const initialState = {
  monthlyGoalsArray: [
    { id: uuid(), title: 'Rent', value: 500 },
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

const monthlyGoalsSlice = createSlice({
  name: 'monthlyGoals',
  initialState,
  reducers: {
    addGoal: (state, action) => {
      state.monthlyGoalsArray.push({
        id: uuid(),
        title: action.payload.title,
        value: action.payload.value
      });
    },
    removeGoal: (state, action) => {
      state.monthlyGoalsArray = state.monthlyGoalsArray.filter(
        (goal) => goal.id !== action.payload.id
      );
    },
    setGoals: (state, action) => {
      state = action.payload;
    }
  }
});

export default monthlyGoalsSlice.reducer;
export const { addGoal, removeGoal, setGoals } = monthlyGoalsSlice.actions;
export const selectAllGoals = (state) => state.monthlyGoals.monthlyGoalsArray;
