import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';
import { User } from '../types/types';

const LOGIN_URL = '/api/auth';
const LOGOUT_URL = '/api/users/logout';
const REGISTER_URL = '/api/users/register';

export const login = createAsyncThunk(
  'user/login',
  async (credentials: { username: string; password: string }) => {
    console.log(
      `Submitting credentials to ${axios.defaults.baseURL + LOGIN_URL}`
    );

    const response = await axios.post(LOGIN_URL, JSON.stringify(credentials), {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });

    const user = response.data.user as User;
    const userId = response.data.user._id as string;

    return { user, userId };
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (credentials: { username: string; password: string }) => {
    console.log(
      `Submitting credentials to ${axios.defaults.baseURL + REGISTER_URL}`
    );

    const response = await axios.post(
      REGISTER_URL,
      JSON.stringify(credentials),
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    );

    const user = response.data.user as User;
    const userId = response.data.user._id as string;

    return { user, userId };
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  try {
    await axios.post(LOGOUT_URL);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
});
