import axios from 'axios';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL
    : process.env.REACT_APP_DEV_API_URL;

console.log(API_BASE_URL);

export default axios.create({
  baseURL: API_BASE_URL
});
