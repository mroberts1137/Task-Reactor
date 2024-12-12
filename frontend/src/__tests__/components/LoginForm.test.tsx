import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../components/LoginForm';
import userReducer from '../../app/userSlice';
import { login } from '../../app/userThunks';

// Mock the userSlice
// jest.mock('../../app/userSlice', () => ({
//   ...jest.requireActual('../../app/userSlice'),
//   default: jest.fn(
//     (
//       state = { userId: null, user: false, status: 'idle', error: null },
//       action
//     ) => state
//   ),
//   login: jest.fn(() => async () => ({
//     type: 'user/login/fulfilled',
//     payload: { userId: '1', user: { user_id: '1', name: 'testuser' } }
//   }))
// }));

// Mock the Loading component
jest.mock('../../components/Loading', () => () => (
  <div data-testid='loading'>Loading...</div>
));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// const makeStore = (
//   initialState = {
//     user: { userId: null, user: false, status: 'idle', error: null }
//   }
// ) => {
//   return configureStore({
//     reducer: {
//       user: userReducer || ((state = initialState.user, action) => state)
//     },
//     preloadedState: initialState ?? {
//       user: {
//         userId: null,
//         user: false,
//         status: 'idle',
//         error: null
//       }
//     }
//   });
// };

const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer
    }
  });
};

describe('LoginForm', () => {
  let store: ReturnType<typeof makeStore>;

  beforeEach(() => {
    store = makeStore();
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });

  const renderLoginForm = () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders login form with initial empty state', async () => {
    renderLoginForm();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });

  it('enables submit button when both fields are filled', async () => {
    renderLoginForm();

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(usernameInput, 'testuser');
    expect(usernameInput).toHaveValue('testuser');
    expect(submitButton).toBeDisabled();

    await userEvent.type(passwordInput, 'testpassword');
    expect(passwordInput).toHaveValue('testpassword');
    expect(submitButton).toBeEnabled();
  });

  it('shows loading state while submitting', async () => {
    renderLoginForm();

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'testpass');

    const mockLoginThunk = jest.fn(
      () => () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    (login as unknown as jest.Mock).mockImplementation(mockLoginThunk);

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Check loading state
    expect(
      screen.getByRole('textbox', { name: /loading/i })
    ).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    renderLoginForm();

    const mockLoginThunk = jest.fn(
      () => () =>
        Promise.resolve({ payload: { id: '1', username: 'testuser' } })
    );
    (login as unknown as jest.Mock).mockImplementation(mockLoginThunk);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'testpass');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles server error responses', async () => {
    renderLoginForm();

    const testCases = [
      {
        error: new Error('Network Error'),
        expectedError: 'No Server Response'
      },
      {
        error: { response: { status: 400 } },
        expectedError: 'Missing Username or Password'
      },
      {
        error: { response: { status: 401 } },
        expectedError: 'Unauthorized'
      },
      {
        error: { response: { status: 500 } },
        expectedError: 'Login Failed'
      }
    ];

    for (const testCase of testCases) {
      // Reset form
      store = makeStore();
      renderLoginForm();

      const mockLoginThunk = jest.fn(
        () => () => Promise.reject(testCase.error)
      );
      (login as unknown as jest.Mock).mockImplementation(mockLoginThunk);

      // Fill and submit form
      await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
      await userEvent.type(screen.getByLabelText(/password/i), 'testpass');
      await userEvent.click(
        screen.getAllByRole('button', { name: /sign in/i })[0]
      );

      // Verify error message
      await waitFor(() => {
        expect(screen.getByText(testCase.expectedError)).toBeInTheDocument();
      });
    }
  });

  it('clears error message when user types', async () => {
    renderLoginForm();

    // Trigger an error first
    const mockLoginThunk = jest.fn(
      () => () => Promise.reject({ response: { status: 401 } })
    );
    (login as unknown as jest.Mock).mockImplementation(mockLoginThunk);

    await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    await userEvent.type(screen.getByLabelText(/password/i), 'testpass');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Unauthorized')).toBeInTheDocument();
    });

    // Type in either field should clear the error
    await userEvent.type(screen.getByLabelText(/username/i), 'a');
    expect(screen.queryByText('Unauthorized')).not.toBeInTheDocument();
  });

  it('sets focus to username input on load', async () => {
    renderLoginForm();
    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toHaveFocus();
    });
  });

  it('sets focus to error message when error occurs', async () => {
    renderLoginForm();

    // Trigger an error
    const mockLoginThunk = jest.fn(
      () => () => Promise.reject({ response: { status: 401 } })
    );
    (login as unknown as jest.Mock).mockImplementation(mockLoginThunk);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'testpass');
    await userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText('Unauthorized');
      expect(errorMessage).toHaveFocus();
    });
  });
});
