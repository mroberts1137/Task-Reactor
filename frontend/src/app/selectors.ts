import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Goal } from '../types/types';

export const selectDailyGoalsEntities = (state: RootState) =>
  state.dailyGoals.entities;
export const selectMonthlyGoalsEntities = (state: RootState) =>
  state.monthlyGoals.entities;
export const selectDailyGoalsIds = (state: RootState) => state.dailyGoals.ids;
export const selectMonthlyGoalsIds = (state: RootState) =>
  state.monthlyGoals.ids;

export const selectOrderedDailyGoals = createSelector(
  [selectDailyGoalsEntities, selectDailyGoalsIds],
  (entities, ids) =>
    ids
      ?.map((id) => entities[id])
      .filter((goal): goal is Goal => goal !== undefined)
);

export const selectOrderedMonthlyGoals = createSelector(
  [selectMonthlyGoalsEntities, selectMonthlyGoalsIds],
  (entities, ids) =>
    ids
      ?.map((id) => entities[id])
      .filter((goal): goal is Goal => goal !== undefined)
);
