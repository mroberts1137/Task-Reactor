import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../types/types';
import { LOGIN_URL, LOGOUT_URL, REGISTER_URL } from '../api/api_urls';

export const login = createAsyncThunk(
  'user/login',
  async (credentials: { username: string; password: string }) => {
    console.log(`Submitting credentials to ${LOGIN_URL}`);

    const response = await axios.post(LOGIN_URL, JSON.stringify(credentials), {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });

    const { _id, username, email, admin } = response.data.user;
    const user = { user_id: _id, username, email, admin } as User;
    const userId = response.data.user._id as string;

    return { user, userId };
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (credentials: { username: string; password: string }) => {
    console.log(`Submitting credentials to ${REGISTER_URL}`);

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
    await axios.post(LOGOUT_URL, {
      withCredentials: true,
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
});
