import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/types'; // Assuming User type is defined here
import { RootState } from './store';

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
  reducers: {
    // Set userId with proper typing for action.payload
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
    // Set user with the User type for action.payload
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    // Logout action, resetting the state
    logout(state) {
      state.userId = '';
      state.user = null;
      state.status = 'idle';
      state.error = null;
    }
  }
});

export default userSlice.reducer;
export const { setUser, setUserId, logout } = userSlice.actions;

// Selectors to retrieve userId and user from the Redux store
export const selectUserId = (state: RootState) => state.user.userId;
export const selectUser = (state: RootState) => state.user.user;
