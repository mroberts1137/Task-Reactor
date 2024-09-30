import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';
import { TASKS_URL } from '../api/api_urls';
import { Task } from '../types/types';
import {
  UserIdPayload,
  UserIdItemPayload,
  UserIdItemIdPayload,
  UserIdItemIdItemPayload
} from '../types/payloads';

const jwt = localStorage.getItem('jwt');
const config = {
  // headers: { Authorization: jwt ? `Bearer ${jwt}` : '' },
  withCredentials: true
};

// @route   GET api/users/:user_id/tasks
// @desc    Get all tasks for a user
// @access  Private
export const fetchTasks = createAsyncThunk<
  Task[], // Return type of the thunk
  UserIdPayload, // Argument type for the thunk
  { rejectValue: string } // Optionally, you can specify the type for rejected value
>('tasks/fetchTasks', async ({ user_id }, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      TASKS_URL.replace('{userId}', user_id),
      config
    );
    const responseOK = response && response.statusText === 'OK';
    if (!responseOK) throw new Error('Failed to fetch tasks');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// @route   POST api/users/:user_id/tasks
// @desc    Create a task for a user
// @access  Private
export const addTask = createAsyncThunk(
  'tasks/addTask',
  async ({ user_id, item }: UserIdItemPayload) => {
    try {
      const response = await axios.post(
        TASKS_URL.replace('{userId}', user_id),
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

// @route   GET api/users/:user_id/tasks/:task_id
// @desc    Get task by id for a user
// @access  Private
export const getTaskById = createAsyncThunk(
  'tasks/getTaskById',
  async ({ user_id, item_id }: UserIdItemIdPayload) => {
    try {
      const response = await axios.get(
        `${TASKS_URL.replace('{userId}', user_id)}/${item_id}`,
        config
      );
      return response.data;
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }
);

// @route   PUT api/users/:user_id/tasks/:task_id
// @desc    Update a task for a user
// @access  Private
export const updateTaskById = createAsyncThunk(
  'tasks/updateTaskById',
  async ({
    user_id,
    item_id,
    updatedItem: updatedTask
  }: UserIdItemIdItemPayload) => {
    try {
      const response = await axios.put(
        `${TASKS_URL.replace('{userId}', user_id)}/${item_id}`,
        updatedTask,
        config
      );
      return response.data;
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }
);

export interface TaskResponse {
  // Define the structure of the response data
  id: string;
  title: string;
  // Add other fields as necessary
}

// @route   DELETE api/users/:user_id/tasks/:task_id
// @desc    Delete a task for a user
// @access  Private
export const removeTaskById = createAsyncThunk<Response, UserIdItemIdPayload>(
  'tasks/removeTaskById',
  async ({ user_id, item_id }: UserIdItemIdPayload) => {
    try {
      const response = await axios.delete(
        `${TASKS_URL.replace('{userId}', user_id)}/${item_id}`,
        config
      );
      return response.data;
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }
);
