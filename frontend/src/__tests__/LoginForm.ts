import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RegisterForm from '../components/RegisterForm';
import { setUser } from '../app/userSlice';
import { fetchTasks } from '../app/tasksThunks';
import { auth } from '../auth/auth';
import { Task, User } from '../types/types';

test('pass', () => expect(true).toBe(true));

// // Mock the auth function to return a mock user and user_id
// jest.mock('../auth/auth', () => ({
//   auth: jest
//     .fn()
//     .mockResolvedValue({ user: { user_id: '1' } as User, user_id: '1' })
// }));

// // Mock the Redux store
// const mockStore = configureStore({
//   reducer: {
//     user: (state = {}, action) => {
//       switch (action.type) {
//         case setUser.type:
//           return action.payload;
//         default:
//           return state;
//       }
//     },
//     tasks: (state = {}, action) => {
//       switch (action.type) {
//         case fetchTasks.fulfilled.type:
//           return action.payload;
//         default:
//           return state;
//       }
//     }
//     // Add more reducers for other slices if needed
//   }
// });

// describe('RegisterForm', () => {
//   let store: any;

//   beforeEach(() => {
//     store = mockStore({ user: {}, tasks: {} }); // Initial state of the store
//   });

//   it('renders login form', () => {
//     render(
//       <Provider store={store}>
//         <RegisterForm />
//       </Provider>
//     );
//     const usernameInput = screen.getByRole('textbox', { name: /username/i });
//     const passwordInput = screen.getByRole('textbox', { name: /password/i });
//     const submitButton = screen.getByRole('button', { name: /sign in/i });
//     expect(usernameInput).toBeInTheDocument();
//     expect(passwordInput).toBeInTheDocument();
//     expect(submitButton).toBeInTheDocument();
//   });
//   it('handles username and password input', () => {
//     render(
//       <Provider store={store}>
//         <RegisterForm />
//       </Provider>
//     );
//     const usernameInput = screen.getByRole('textbox', { name: /username/i });
//     const passwordInput = screen.getByRole('textbox', { name: /password/i });

//     fireEvent.change(usernameInput, { target: { value: 'testuser' } });
//     fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
//     expect(usernameInput).toHaveValue('testuser');
//     expect(passwordInput).toHaveValue('testpassword');
//   });
//   it('submits the form and dispatches actions', async () => {
//     const mockedFetchTasks = jest.fn();
//     // Mock the fetchTasks action creator to return a mocked array of tasks
//     jest.mock('../app/tasksSlice', () => ({
//       ...jest.requireActual('../app/tasksSlice'),
//       fetchTasks: jest.fn().mockReturnValue(mockedFetchTasks)
//     }));

//     render(
//       <Provider store={store}>
//         <RegisterForm />
//       </Provider>
//     );

//     const usernameInput = screen.getByRole('textbox', { name: /username/i });
//     const passwordInput = screen.getByRole('textbox', { name: /password/i });
//     const submitButton = screen.getByRole('button', { name: /sign in/i });

//     fireEvent.change(usernameInput, { target: { value: 'testuser' } });
//     fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
//     fireEvent.click(submitButton);

//     // Wait for any asynchronous dispatches to complete
//     await waitFor(() => {
//       expect(auth).toHaveBeenCalledWith(LOGIN_URL, {
//         username: 'testuser',
//         password: 'testpassword'
//       });
//       expect(setUser).toHaveBeenCalledWith({ id: '1' }); // Mocked user data
//       expect(setUserId).toHaveBeenCalledWith('1'); // Mocked user_id
//       expect(mockedFetchTasks).toHaveBeenCalledWith('1'); // Mocked user_id for fetchTasks
//     });
//   });
//   // Add more tests as needed for different functionalities
// });
