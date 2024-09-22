import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
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
export const selectUserId = (state) => state.user.userId;
export const selectUser = (state) => state.user.user;
