import axios from 'axios';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.API_URL
    : process.env.DEV_API_URL;

export default axios.create({
  baseURL: 'http://localhost:5000'
});
