import axios from 'axios';

export const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL
    : process.env.REACT_APP_DEV_API_URL;

export default axios.create({
  baseURL: API_BASE_URL
});

export const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return error.message || 'An unexpected error occurred';
};
