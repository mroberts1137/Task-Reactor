import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/types'; // Assuming User type is defined here
import { RootState } from './store';
import { login, logout, register } from './userThunks';
export { login, logout, register };

// Define the state type
interface UserState {
  userId: string;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the initial state with the correct type
const initialState: UserState = {
  userId: '',
  user: null,
  status: 'idle',
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.userId = action.payload.userId;
      state.user = action.payload.user;
      state.status = 'idle';
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.userId = action.payload.userId;
      state.user = action.payload.user;
      state.status = 'idle';
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.userId = '';
      state.user = null;
      state.status = 'idle';
      state.error = null;
    });
  }
});

export default userSlice.reducer;
// export const { setUser, setUserId } = userSlice.actions;

// Selectors to retrieve userId and user from the Redux store
export const selectUserId = (state: RootState) => state.user.userId;
export const selectUser = (state: RootState) => state.user.user;
