import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleError } from '../api/axios';
import { DAILY_GOALS_URL } from '../api/api_urls';

import {
  UserIdPayload,
  UserIdItemPayload,
  UserIdItemIdPayload,
  UserIdItemIdItemPayload
} from '../types/payloads';
import {
  FrontendDocument,
  MongoDocument,
  transformMongoDocument,
  transformToMongoDocument
} from '../utils/transformMongoDoc';
import { Goal } from '../types/types';

const config = {
  withCredentials: true
};

// @route   GET api/users/:user_id/daily_goals
// @desc    Get all daily goals for a user
// @access  Private
export const fetchDailyGoals = createAsyncThunk<
  FrontendDocument<Goal>[],
  UserIdPayload,
  { rejectValue: string }
>('dailyGoals/fetchDailyGoals', async ({ user_id }) => {
  try {
    const response = await axios.get<MongoDocument<Goal>[]>(
      DAILY_GOALS_URL.replace('{userId}', user_id),
      config
    );
    console.log(response);
    // const responseOK = response && response.statusText === 'OK';

    // if (!responseOK) throw new Error('Failed to fetch daily goals');
    if (!response.data || response.data?.length === 0) return [];

    return response.data?.map(transformMongoDocument);
  } catch (err) {
    console.error(`Error: ${err}`);
    throw err;
  }
});

// @route   POST api/users/:user_id/daily_goals
// @desc    Create a daily goal for a user
// @access  Private
export const addDailyGoal = createAsyncThunk<
  FrontendDocument<Goal>,
  UserIdItemPayload,
  { rejectValue: string }
>('dailyGoals/addDailyGoal', async ({ user_id, item }, { rejectWithValue }) => {
  try {
    const response = await axios.post<MongoDocument<Goal>>(
      DAILY_GOALS_URL.replace('{userId}', user_id),
      item,
      config
    );
    return transformMongoDocument<Goal>(response.data);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// @route   GET api/users/:user_id/daily_goals/:daily_goal_id
// @desc    Get daily goal by id for a user
// @access  Private
export const getDailyGoalById = createAsyncThunk<
  FrontendDocument<Goal>,
  UserIdItemIdPayload,
  { rejectValue: string }
>('dailyGoals/getDailyGoalById', async ({ user_id, item_id }) => {
  try {
    const response = await axios.get<MongoDocument<Goal>>(
      `${DAILY_GOALS_URL.replace('{userId}', user_id)}/${item_id}`,
      config
    );
    return transformMongoDocument<Goal>(response.data);
  } catch (err) {
    console.error(`Error: ${err}`);
    throw err;
  }
});

// @route   PUT api/users/:user_id/daily_goals/:daily_goal_id
// @desc    Update a daily goal for a user
// @access  Private
export const updateDailyGoalById = createAsyncThunk<
  FrontendDocument<Goal>,
  UserIdItemIdItemPayload,
  { rejectValue: string }
>(
  'dailyGoals/updateDailyGoalById',
  async ({ user_id, item_id, updatedItem }) => {
    try {
      const mongoFormatData = transformToMongoDocument(updatedItem);
      const response = await axios.put<MongoDocument<Goal>>(
        `${DAILY_GOALS_URL.replace('{userId}', user_id)}/${item_id}`,
        mongoFormatData,
        config
      );
      return transformMongoDocument<Goal>(response.data);
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }
);

// @route   DELETE api/users/:user_id/daily_goals/:daily_goal_id
// @desc    Delete a daily goal for a user
// @access  Private
export const removeDailyGoalById = createAsyncThunk<
  FrontendDocument<Goal>,
  UserIdItemIdPayload,
  { rejectValue: string }
>('dailyGoals/removeDailyGoalById', async ({ user_id, item_id }) => {
  try {
    const response = await axios.delete<MongoDocument<Goal>>(
      `${DAILY_GOALS_URL.replace('{userId}', user_id)}/${item_id}`,
      config
    );
    return transformMongoDocument<Goal>(response.data);
  } catch (err) {
    console.error(`Error: ${err}`);
    throw err;
  }
});
