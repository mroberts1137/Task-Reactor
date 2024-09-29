import axios from '../api/axios';

export const auth = async (
  url: string,
  credentials: { username: string; password: string }
) => {
  console.log(`Submitting credentials to ${axios.defaults.baseURL + url}`);

  const response = await axios.post(url, JSON.stringify(credentials), {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
  });

  const user = response.data.user;
  const user_id = response.data.user._id;

  return { user, user_id };
};
