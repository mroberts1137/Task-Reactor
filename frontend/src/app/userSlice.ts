import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

const initialState = {
  userId: '',
  user: null,
  status: 'idle',
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  }
});

export default userSlice.reducer;
export const { setUserId, setUser, setError } = userSlice.actions;
export const selectUserId = (state: RootState) => state.user.userId;
export const selectUser = (state: RootState) => state.user.user;
