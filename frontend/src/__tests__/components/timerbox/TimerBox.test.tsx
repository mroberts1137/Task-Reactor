import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { legacy_configureStore as configureStore } from 'redux-mock-store';
import {
  EarningsContext,
  EarningsContextType,
  UserContext,
  UserContextType
} from '../../../contexts/context';
import TimerBox from '../../../components/timerbox/TimerBox';
import { User } from '../../../types/types';
import { addTask } from '../../../app/tasksThunks';
import { theme, ThemeProvider } from '../../../__mocks__/styled-components';

jest.useFakeTimers();

const mockStore = configureStore([]);

describe('TimerBox', () => {
  const mockEarningsChange = jest.fn();
  const mockUser: User = { user_id: 'testUser123' };
  const mockUserContext: UserContextType = {
    user: mockUser,
    user_id: 'testUser123',
    isLoading: false,
    error: null
  };
  const mockEarningsContext: EarningsContextType = {
    dailyTasksEarnings: 100,
    dailyTotalEarnings: 200,
    monthlyTasksEarnings: 500,
    monthlyTotalEarnings: 600,
    earningsChange: mockEarningsChange
  };

  let store;

  beforeEach(() => {
    store = mockStore({
      savedTasks: []
    });
    store.dispatch = jest.fn();
  });

  const renderWithProviders = (ui: React.ReactNode) => {
    return render(
      <Provider store={store}>
        <UserContext.Provider value={mockUserContext}>
          <EarningsContext.Provider value={mockEarningsContext}>
            <ThemeProvider theme={theme}>{ui}</ThemeProvider>
          </EarningsContext.Provider>
        </UserContext.Provider>
      </Provider>
    );
  };

  it('start button is disabled when task is invalid', () => {
    renderWithProviders(<TimerBox />);
    const startButton = screen.getByText('Start');
    expect(startButton).toBeDisabled();
  });

  it('enables start button when task is valid', () => {
    renderWithProviders(<TimerBox />);

    // Fill in task form
    fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
      target: { value: 'Test Task' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter hourly rate'), {
      target: { value: '20' }
    });

    const startButton = screen.getByText('Start');
    expect(startButton).not.toBeDisabled();
  });

  it('updates task and dispatches when stopping timer', async () => {
    renderWithProviders(<TimerBox />);

    // Fill in task form
    fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
      target: { value: 'Test Task' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter hourly rate'), {
      target: { value: '20' }
    });

    // Start timer
    const startButton = screen.getByText('Start');
    expect(startButton).toBeEnabled();

    fireEvent.click(startButton);
    expect(screen.getByText('Running...')).toBeInTheDocument();

    // Advance timer by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Stop timer
    fireEvent.click(screen.getByText('Stop'));

    // Get the thunk that was dispatched
    const dispatchedThunk = store.dispatch.mock.calls[0][0];

    // Create a mock dispatch function
    const mockDispatch = jest.fn();

    // Execute the thunk
    await dispatchedThunk(mockDispatch, () => store.getState(), undefined);

    // Now you can check what the thunk dispatched
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: addTask.pending.type,
        meta: expect.objectContaining({
          arg: expect.objectContaining({
            user_id: mockUser.user_id,
            item: expect.objectContaining({
              title: 'Test Task',
              hourlyRate: 20,
              duration: 5000
            })
          })
        })
      })
    );
  });

  it('disables form inputs while timer is running', () => {
    renderWithProviders(<TimerBox />);

    fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
      target: { value: 'Test Task' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter hourly rate'), {
      target: { value: '20' }
    });

    fireEvent.click(screen.getByText('Start'));

    expect(screen.getByPlaceholderText('Enter task title')).toBeDisabled();
    expect(screen.getByPlaceholderText('Enter hourly rate')).toBeDisabled();
  });

  it('uupdates earnings correctly while timer runs', () => {
    renderWithProviders(<TimerBox />);

    // Fill in task form
    fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
      target: { value: 'Test Task' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter hourly rate'), {
      target: { value: '60' }
    });

    // Start timer
    fireEvent.click(screen.getByText('Start'));

    // Advance timer by 1 hour
    act(() => {
      jest.advanceTimersByTime(3600000);
    });

    expect(mockEarningsChange).toHaveBeenCalledWith(60);
  });

  it('displays conflict message when trying to save duplicate task', () => {
    store = mockStore({
      savedTasks: [
        { id: '1', title: 'Existing Task', hourlyRate: 20, taxRate: 10 }
      ]
    });

    renderWithProviders(<TimerBox />);

    // Fill in task form with existing task name
    fireEvent.change(screen.getByPlaceholderText('Enter task title'), {
      target: { value: 'Existing Task' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter hourly rate'), {
      target: { value: '30' }
    });

    // Try to save
    fireEvent.click(screen.getByText('Save Task'));

    expect(screen.getByText('Task already exists.')).toBeInTheDocument();
  });
});
