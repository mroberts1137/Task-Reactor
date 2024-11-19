import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleError } from '../api/axios';
import { MONTHLY_GOALS_URL } from '../api/api_urls';

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

// @route   GET api/users/:user_id/monthly_goals
// @desc    Get all monthly goals for a user
// @access  Private
export const fetchMonthlyGoals = createAsyncThunk<
  FrontendDocument<Goal>[],
  UserIdPayload,
  { rejectValue: string }
>('monthlyGoals/fetchMonthlyGoals', async ({ user_id }) => {
  try {
    const response = await axios.get<MongoDocument<Goal>[]>(
      MONTHLY_GOALS_URL.replace('{userId}', user_id),
      config
    );
    console.log(response);
    // const responseOK = response && response.statusText === 'OK';

    // if (!responseOK) throw new Error('Failed to fetch monthly goals');
    if (!response.data || response.data?.length === 0) return [];

    return response.data?.map(transformMongoDocument);
  } catch (err) {
    console.error(`Error: ${err}`);
    throw err;
  }
});

// @route   POST api/users/:user_id/monthly_goals
// @desc    Create a monthly goal for a user
// @access  Private
export const addMonthlyGoal = createAsyncThunk<
  FrontendDocument<Goal>,
  UserIdItemPayload,
  { rejectValue: string }
>('monthlyGoals/addMonthlyGoal', async ({ user_id, item }) => {
  try {
    const response = await axios.post<MongoDocument<Goal>>(
      MONTHLY_GOALS_URL.replace('{userId}', user_id),
      item,
      config
    );
    return transformMongoDocument<Goal>(response.data);
  } catch (err) {
    console.error(`Error: ${err}`);
    throw err;
  }
});

// @route   GET api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Get monthly goal by id for a user
// @access  Private
export const getMonthlyGoalById = createAsyncThunk<
  FrontendDocument<Goal>,
  UserIdItemIdPayload,
  { rejectValue: string }
>('monthlyGoals/getMonthlyGoalById', async ({ user_id, item_id }) => {
  try {
    const response = await axios.get<MongoDocument<Goal>>(
      `${MONTHLY_GOALS_URL.replace('{userId}', user_id)}/${item_id}`,
      config
    );
    return transformMongoDocument<Goal>(response.data);
  } catch (err) {
    console.error(`Error: ${err}`);
    throw err;
  }
});

// @route   PUT api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Update a monthly goal for a user
// @access  Private
export const updateMonthlyGoalById = createAsyncThunk<
  FrontendDocument<Goal>,
  UserIdItemIdItemPayload,
  { rejectValue: string }
>(
  'monthlyGoals/updateMonthlyGoalById',
  async ({ user_id, item_id, updatedItem }) => {
    try {
      const mongoFormatData = transformToMongoDocument(updatedItem);
      const response = await axios.put<MongoDocument<Goal>>(
        `${MONTHLY_GOALS_URL.replace('{userId}', user_id)}/${item_id}`,
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

// @route   DELETE api/users/:user_id/monthly_goals/:monthly_goal_id
// @desc    Delete a monthly goal for a user
// @access  Private
export const removeMonthlyGoalById = createAsyncThunk<
  FrontendDocument<Goal>,
  UserIdItemIdPayload,
  { rejectValue: string }
>('monthlyGoals/removeMonthlyGoalById', async ({ user_id, item_id }) => {
  try {
    const response = await axios.delete<MongoDocument<Goal>>(
      `${MONTHLY_GOALS_URL.replace('{userId}', user_id)}/${item_id}`,
      config
    );
    return transformMongoDocument<Goal>(response.data);
  } catch (err) {
    console.error(`Error: ${err}`);
    throw err;
  }
});
