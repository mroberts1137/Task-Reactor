import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';
import { MONTHLY_GOALS_URL } from '../api/api_urls';

import {
  UserIdPayload,
  UserIdItemPayload,
  UserIdItemIdPayload,
  UserIdItemIdItemPayload
} from '../types/payloads';

const jwt = localStorage.getItem('jwt');
const config = {
  headers: { Authorization: `Bearer ${jwt}` },
  withCredentials: true
};

// @route   GET api/users/:user_id/monthly_goals
// @desc    Get all monthly goals for a user
// @access  Private
export const fetchMonthlyGoals = createAsyncThunk(
  'monthlyGoals/fetchMonthlyGoals',
  async ({ user_id }: UserIdPayload) => {
    try {
      const response = await axios.get(
        MONTHLY_GOALS_URL.replace('{userId}', user_id),
        config
      );
      return response.data;
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }
);

// @route   POST api/users/:user_id/monthly_goals
// @desc    Create a monthly goal for a user
// @access  Private
export const addMonthlyGoal = createAsyncThunk(
  'monthlyGoals/addMonthlyGoal',
  async ({ user_id, item }: UserIdItemPayload) => {
    try {
      const response = await axios.post(
        MONTHLY_GOALS_URL.replace('{userId}', user_id),
        item,
        config
      );
      return response.data;
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }
);

// @route   GET api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Get monthly goal by id for a user
// @access  Private
export const getMonthlyGoalById = createAsyncThunk(
  'monthlyGoals/getMonthlyGoalById',
  async ({ user_id, item_id }: UserIdItemIdPayload) => {
    try {
      const response = await axios.get(
        MONTHLY_GOALS_URL.replace('{userId}', user_id) + `/${item_id}`,
        config
      );
      return response.data;
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }
);

// @route   PUT api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Update a monthly goal for a user
// @access  Private
export const updateMonthlyGoalById = createAsyncThunk(
  'monthlyGoals/updateMonthlyGoalById',
  async ({ user_id, item_id, updatedItem }: UserIdItemIdItemPayload) => {
    try {
      const response = await axios.put(
        MONTHLY_GOALS_URL.replace('{userId}', user_id) + `/${item_id}`,
        updatedItem,
        config
      );
      return response.data;
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }
);

// @route   DELETE api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Delete a monthly goal for a user
// @access  Private
export const removeMonthlyGoalById = createAsyncThunk(
  'monthlyGoals/removeMonthlyGoalById',
  async ({ user_id, item_id }: UserIdItemIdPayload) => {
    try {
      const response = await axios.delete(
        MONTHLY_GOALS_URL.replace('{userId}', user_id) + `/${item_id}`,
        config
      );
      return response.data;
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }
);
