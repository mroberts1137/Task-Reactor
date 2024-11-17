import axios from 'axios';

export const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return error.message || 'An unexpected error occurred';
};
