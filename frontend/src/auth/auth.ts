import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';
import { User } from '../types/types';
import { VERIFY_SESSION_URL } from '../api/api_urls';

export const auth = async (
  url: string,
  credentials: { username: string; password: string }
): Promise<{ user: User; user_id: string }> => {
  console.log(`Submitting credentials to ${axios.defaults.baseURL + url}`);

  const response = await axios.post(url, JSON.stringify(credentials), {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  });

  const user = response.data.user;
  const user_id = response.data.user._id;

  return { user, user_id };
};

export const verifySession = createAsyncThunk(
  'auth/verifySession',
  async () => {
    try {
      console.log('Verifying token...');
      const response = await axios.get(VERIFY_SESSION_URL, {
        withCredentials: true
      });
      return response.data.valid; // API responds with { valid: true/false }
    } catch (error) {
      return false;
    }
  }
);
