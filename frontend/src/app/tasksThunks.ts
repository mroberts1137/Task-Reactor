import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleError } from '../api/axios';
import { TASKS_URL } from '../api/api_urls';
import { Task } from '../types/types';
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

const config = {
  withCredentials: true
};

// @route   GET api/users/:user_id/tasks
// @desc    Get all tasks for a user
// @access  Private
export const fetchTasks = createAsyncThunk<
  FrontendDocument<Task>[],
  UserIdPayload,
  { rejectValue: string }
>('tasks/fetchTasks', async ({ user_id }, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      TASKS_URL.replace('{userId}', user_id),
      config
    );
    // console.log(response);
    // const responseOK = response && response.statusText === 'OK';

    // if (!responseOK) throw new Error('Failed to fetch tasks');
    if (!response.data) return [];

    return (response.data || []).map(transformMongoDocument);
  } catch (error) {
    return rejectWithValue(handleError(error));
  }
});

// @route   POST api/users/:user_id/tasks
// @desc    Create a task for a user
// @access  Private
export const addTask = createAsyncThunk<
  FrontendDocument<Task>,
  UserIdItemPayload,
  { rejectValue: string }
>('tasks/addTask', async ({ user_id, item }, { rejectWithValue }) => {
  try {
    const response = await axios.post<MongoDocument<Task>>(
      TASKS_URL.replace('{userId}', user_id),
      item,
      config
    );
    return transformMongoDocument<Task>(response.data);
  } catch (error) {
    return rejectWithValue(handleError(error));
  }
});

// @route   GET api/users/:user_id/tasks/:task_id
// @desc    Get task by id for a user
// @access  Private
export const getTaskById = createAsyncThunk<
  FrontendDocument<Task>,
  UserIdItemIdPayload,
  { rejectValue: string }
>('tasks/getTaskById', async ({ user_id, item_id }, { rejectWithValue }) => {
  try {
    const response = await axios.get<MongoDocument<Task>>(
      `${TASKS_URL.replace('{userId}', user_id)}/${item_id}`,
      config
    );
    return transformMongoDocument<Task>(response.data);
  } catch (error) {
    return rejectWithValue(handleError(error));
  }
});

// @route   PUT api/users/:user_id/tasks/:task_id
// @desc    Update a task for a user
// @access  Private
export const updateTaskById = createAsyncThunk<
  FrontendDocument<Task>,
  UserIdItemIdItemPayload,
  { rejectValue: string }
>(
  'tasks/updateTaskById',
  async ({ user_id, item_id, updatedItem }, { rejectWithValue }) => {
    try {
      const mongoFormatData = transformToMongoDocument<Task>(updatedItem);
      const response = await axios.put<MongoDocument<Task>>(
        `${TASKS_URL.replace('{userId}', user_id)}/${item_id}`,
        mongoFormatData,
        config
      );
      return transformMongoDocument<Task>(response.data);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// @route   DELETE api/users/:user_id/tasks/:task_id
// @desc    Delete a task for a user
// @access  Private
export const removeTaskById = createAsyncThunk<
  FrontendDocument<Task>,
  UserIdItemIdPayload,
  { rejectValue: string }
>('tasks/removeTaskById', async ({ user_id, item_id }, { rejectWithValue }) => {
  try {
    const response = await axios.delete<MongoDocument<Task>>(
      `${TASKS_URL.replace('{userId}', user_id)}/${item_id}`,
      config
    );
    return transformMongoDocument<Task>(response.data);
  } catch (error) {
    return rejectWithValue(handleError(error));
  }
});
