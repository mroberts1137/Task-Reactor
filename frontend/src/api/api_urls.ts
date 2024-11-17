export const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL
    : process.env.REACT_APP_DEV_API_URL;

export const LOGIN_URL = API_BASE_URL + '/api/auth';
export const LOGOUT_URL = API_BASE_URL + '/api/users/logout';
export const REGISTER_URL = API_BASE_URL + '/api/users/register';
export const TASKS_URL = API_BASE_URL + '/api/users/{userId}/tasks';
export const DAILY_GOALS_URL = API_BASE_URL + '/api/users/{userId}/daily_goals';
export const MONTHLY_GOALS_URL =
  API_BASE_URL + '/api/users/{userId}/monthly_goals';
export const VERIFY_SESSION_URL = API_BASE_URL + '/api/auth/verify-session';
