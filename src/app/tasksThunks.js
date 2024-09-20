import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';
const TASKS_URL = '/api/users/{userId}/tasks';
const jwt = localStorage.getItem('jwt');

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId) => {
    const response = await axios.get(TASKS_URL.replace('{userId}', userId), {
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      withCredentials: true
    });
    return response.data;
  }
);

export const addTaskAsync = createAsyncThunk(
  'tasks/addTask',
  async (userId, task) => {
    const response = await axios.post(
      TASKS_URL.replace('{userId}', userId),
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        withCredentials: true
      },
      task
    );
    return response.data;
  }
);

export const removeTaskAsync = createAsyncThunk(
  'tasks/removeTask',
  async (userId, id) => {
    const response = await axios.delete(
      TASKS_URL.replace('{userId}', userId) + '/' + id,
      {
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        withCredentials: true
      }
    );
    return response.data;
  }
);
