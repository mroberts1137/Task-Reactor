import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

const jwt = localStorage.getItem('jwt');

const TASKS_URL = '/api/users/{userId}/tasks';

// @route   GET api/users/:user_id/tasks
// @desc    Get all tasks for a user
// @access  Private
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId) => {
    const response = await axios.get(TASKS_URL.replace('{userId}', userId), {
      headers: { Authorization: `Bearer ${jwt}` },
      withCredentials: true
    });
    return response.data;
  }
);

// @route   POST api/users/:user_id/tasks
// @desc    Create a task for a user
// @access  Private
export const addTaskAsync = createAsyncThunk(
  'tasks/addTaskAsync',
  async (userId, task) => {
    const response = await axios.post(
      TASKS_URL.replace('{userId}', userId),
      {
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true
      },
      task
    );
    return response.data;
  }
);

// @route   GET api/users/:user_id/tasks/:task_id
// @desc    Get task by id for a user
// @access  Private
export const getTaskById = createAsyncThunk(
  'tasks/getTaskById',
  async (userId, id) => {
    const response = await axios.post(
      TASKS_URL.replace('{userId}', userId) + `/${id}`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true
      }
    );
    return response.data;
  }
);

// @route   PUT api/users/:user_id/tasks/:task_id
// @desc    Update a task for a user
// @access  Private
export const updateTaskById = createAsyncThunk(
  'tasks/updateTaskById',
  async (userId, id, updatedTask) => {
    const response = await axios.put(
      TASKS_URL.replace('{userId}', userId) + `/${id}`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true
      },
      updatedTask
    );
    return response.data;
  }
);

// @route   DELETE api/users/:user_id/tasks/:task_id
// @desc    Delete a task for a user
// @access  Private
export const removeTaskAsync = createAsyncThunk(
  'tasks/removeTaskAsync',
  async (userId, id) => {
    const response = await axios.delete(
      TASKS_URL.replace('{userId}', userId) + `/${id}`,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true
      }
    );
    return response.data;
  }
);