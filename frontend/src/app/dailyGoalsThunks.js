import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';
import { DAILY_GOALS_URL } from '../api/api_urls';

const jwt = localStorage.getItem('jwt');
const config = {
  headers: { Authorization: `Bearer ${jwt}` },
  withCredentials: true
};

// @route   GET api/users/:user_id/daily_goals
// @desc    Get all daily goals for a user
// @access  Private
export const fetchDailyGoals = createAsyncThunk(
  'dailyGoals/fetchDailyGoals',
  async (user_id) => {
    const response = await axios.get(
      DAILY_GOALS_URL.replace('{userId}', user_id),
      config
    );
    return response.data;
  }
);

// @route   POST api/users/:user_id/daily_goals
// @desc    Create a daily goal for a user
// @access  Private
export const addDailyGoal = createAsyncThunk(
  'dailyGoals/addDailyGoal',
  async (user_id, goal) => {
    const response = await axios.post(
      DAILY_GOALS_URL.replace('{userId}', user_id),
      config,
      goal
    );
    return response.data;
  }
);

// @route   GET api/users/:user_id/daily_goals/:daily_goal_id
// @desc    Get daily goal by id for a user
// @access  Private
export const getDailyGoalById = createAsyncThunk(
  'dailyGoals/getDailyGoalById',
  async (user_id, daily_goal_id) => {
    const response = await axios.get(
      DAILY_GOALS_URL.replace('{userId}', user_id) + `/${daily_goal_id}`,
      config
    );
    return response.data;
  }
);

// @route   PUT api/users/:user_id/daily_goals/:daily_goal_id
// @desc    Update a daily goal for a user
// @access  Private
export const updateDailyGoalById = createAsyncThunk(
  'dailyGoals/updateDailyGoalById',
  async (user_id, daily_goal_id, updatedGoal) => {
    const response = await axios.put(
      DAILY_GOALS_URL.replace('{userId}', user_id) + `/${daily_goal_id}`,
      config,
      updatedGoal
    );
    return response.data;
  }
);

// @route   DELETE api/users/:user_id/daily_goals/:daily_goal_id
// @desc    Delete a daily goal for a user
// @access  Private
export const removeDailyGoalById = createAsyncThunk(
  'dailyGoals/removeDailyGoalById',
  async (user_id, daily_goal_id) => {
    const response = await axios.delete(
      DAILY_GOALS_URL.replace('{userId}', user_id) + `/${daily_goal_id}`,
      config
    );
    return response.data;
  }
);
