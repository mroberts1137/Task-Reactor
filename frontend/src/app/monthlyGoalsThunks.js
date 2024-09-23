import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const jwt = localStorage.getItem('jwt');
const config = {
  headers: { Authorization: `Bearer ${jwt}` },
  withCredentials: true
};

const MONTHLY_GOALS_URL = '/api/users/{userId}/monthly_goals';

// @route   GET api/users/:user_id/monthly_goals
// @desc    Get all monthly goals for a user
// @access  Private
export const fetchMonthlyGoals = createAsyncThunk(
  'monthlyGoals/fetchMonthlyGoals',
  async (user_id) => {
    const response = await axios.get(
      MONTHLY_GOALS_URL.replace('{userId}', user_id),
      config
    );
    return response.data;
  }
);

// @route   POST api/users/:user_id/monthly_goals
// @desc    Create a monthly goal for a user
// @access  Private
export const addMonthlyGoal = createAsyncThunk(
  'monthlyGoals/addMonthlyGoal',
  async (user_id, goal) => {
    const response = await axios.post(
      MONTHLY_GOALS_URL.replace('{userId}', user_id),
      config,
      goal
    );
    return response.data;
  }
);

// @route   GET api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Get monthly goal by id for a user
// @access  Private
export const getMonthlyGoalById = createAsyncThunk(
  'monthlyGoals/getMonthlyGoalById',
  async (user_id, monthly_goal_id) => {
    const response = await axios.get(
      MONTHLY_GOALS_URL.replace('{userId}', user_id) + `/${monthly_goal_id}`,
      config
    );
    return response.data;
  }
);

// @route   PUT api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Update a monthly goal for a user
// @access  Private
export const updateMonthlyGoalById = createAsyncThunk(
  'monthlyGoals/updateMonthlyGoalById',
  async (user_id, monthly_goal_id, updatedGoal) => {
    const response = await axios.put(
      MONTHLY_GOALS_URL.replace('{userId}', user_id) + `/${monthly_goal_id}`,
      config,
      updatedGoal
    );
    return response.data;
  }
);

// @route   DELETE api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Delete a monthly goal for a user
// @access  Private
export const removeMonthlyGoalById = createAsyncThunk(
  'monthlyGoals/removeMonthlyGoalById',
  async (user_id, monthly_goal_id) => {
    const response = await axios.delete(
      MONTHLY_GOALS_URL.replace('{userId}', user_id) + `/${monthly_goal_id}`,
      config
    );
    return response.data;
  }
);
