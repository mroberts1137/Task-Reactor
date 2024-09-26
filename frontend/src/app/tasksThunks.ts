import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';
import { TASKS_URL } from '../api/api_urls';
import { Task } from '../types/tasks';

interface UserIdTaskPayload {
  user_id: string;
  task: Task;
}

interface UserIdTaskIdPayload {
  user_id: string;
  task_id: string;
}

interface UserIdTaskIdTaskPayload {
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
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (user_id: string) => {
    try {
      const response = await axios.get(
        TASKS_URL.replace('{userId}', user_id),
        config
      );
      return response.data;
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }
);

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
