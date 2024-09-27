import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';
import { TASKS_URL } from '../api/api_urls';
import { Task } from '../types/types';

export interface UserIdPayload {
  user_id: string;
}
export interface UserIdTaskPayload {
  user_id: string;
  task: Task;
}

export interface UserIdTaskIdPayload {
  user_id: string;
  task_id: string;
}

export interface UserIdTaskIdTaskPayload {
  user_id: string;
  task_id: string;
  updatedTask: Task;
}

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
    return rejectWithValue(error.message); // Handle errors
  }
});

// @route   POST api/users/:user_id/tasks
// @desc    Create a task for a user
// @access  Private
export const addTask = createAsyncThunk(
  'tasks/addTask',
  async ({ user_id, task }: UserIdTaskPayload) => {
    try {
      const response = await axios.post(
        TASKS_URL.replace('{userId}', user_id),
        task,
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
  async ({ user_id, task_id }: UserIdTaskIdPayload) => {
    try {
      const response = await axios.get(
        `${TASKS_URL.replace('{userId}', user_id)}/${task_id}`,
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
  async ({ user_id, task_id, updatedTask }: UserIdTaskIdTaskPayload) => {
    try {
      const response = await axios.put(
        `${TASKS_URL.replace('{userId}', user_id)}/${task_id}`,
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

// @route   DELETE api/users/:user_id/tasks/:task_id
// @desc    Delete a task for a user
// @access  Private
export const removeTaskById = createAsyncThunk(
  'tasks/removeTaskById',
  async ({ user_id, task_id }: UserIdTaskIdPayload) => {
    try {
      const response = await axios.delete(
        `${TASKS_URL.replace('{userId}', user_id)}/${task_id}`,
        config
      );
      return response.data;
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }
);
