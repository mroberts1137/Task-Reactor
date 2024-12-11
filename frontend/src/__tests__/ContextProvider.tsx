import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { legacy_configureStore as configureStore } from 'redux-mock-store';
import {
  UserContext,
  TaskContext,
  DateContext,
  EarningsContext,
  DailyGoalsContext,
  MonthlyGoalsContext
} from '../contexts/context';
import * as reactRedux from 'react-redux';
import * as tasksThunks from '../app/tasksThunks';
import * as dailyGoalsThunks from '../app/dailyGoalsThunks';
import * as monthlyGoalsThunks from '../app/monthlyGoalsThunks';
import ContextProvider from '../contexts/ContextProvider';

const initialState = {
  user: {
    user_id: 'user123',
    user: { id: 'user123', name: 'Test User' },
    status: 'idle',
    error: null
  },
  tasks: {
    ids: ['task1', 'task2', 'task3'],
    entities: {
      task1: { id: 'task1', netIncome: 50 },
      task2: { id: 'task2', netIncome: 100 },
      task3: { id: 'task3', netIncome: 200 }
    },
    status: 'idle',
    error: null
  },
  dailyGoals: {
    ids: ['goal1'],
    entities: { goal1: { id: 'goal1', value: 10 } },
    status: 'idle',
    error: null
  },
  monthlyGoals: {
    ids: ['goal2'],
    entities: { goal2: { id: 'goal2', value: 20 } },
    status: 'idle',
    error: null
  }
};

const mockStore = configureStore([]);

jest.mock('axios');

// Mock the redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

// Mock the redux slices
jest.mock('../app/userSlice', () => ({
  selectUserId: jest.fn(() => 'user123'),
  selectUser: jest.fn(() => ({ id: 'user123', name: 'Test User' }))
}));
jest.mock('../app/tasksSlice', () => ({
  selectAllTasks: jest.fn(() => [
    { id: 'task1', netIncome: 50 },
    { id: 'task2', netIncome: 100 },
    { id: 'task3', netIncome: 200 }
  ]),
  selectTasksByDate: jest.fn(() => [{ id: 'task1', netIncome: 50 }]),
  selectAllTasksByMonth: jest.fn(() => [
    { id: 'task1', netIncome: 50 },
    { id: 'task2', netIncome: 100 }
  ])
}));
jest.mock('../app/dailyGoalsSlice', () => ({
  selectAllDailyGoals: jest.fn(() => [{ id: 'goal1', value: 10 }])
}));
jest.mock('../app/monthlyGoalsSlice', () => ({
  selectAllMonthlyGoals: jest.fn(() => [{ id: 'goal2', value: 20 }])
}));

// Mock the asyncThunks
jest.mock('../app/tasksThunks', () => ({
  fetchTasks: jest.fn(() => ({ then: jest.fn(() => Promise.resolve()) }))
}));
jest.mock('../app/dailyGoalsThunks', () => ({
  fetchDailyGoals: jest.fn(() => ({ then: jest.fn(() => Promise.resolve()) }))
}));
jest.mock('../app/monthlyGoalsThunks', () => ({
  fetchMonthlyGoals: jest.fn(() => ({
    then: jest.fn(() => Promise.resolve())
  }))
}));

// Mock util functions
jest.mock('../utils/functions', () => ({
  sumTotal: jest.fn((items: number[] | undefined): number => {
    return items && items.length > 0
      ? items.reduce((sum, item) => sum + (item || 0), 0)
      : 0;
  })
}));

describe('ContextProvider', () => {
  let store: typeof mockStore;
  let mockDispatch: typeof mockStore.dispatch;

  beforeEach(() => {
    store = mockStore(initialState);
    mockDispatch = jest.fn(() => Promise.resolve());
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(
      mockDispatch
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (children: React.ReactNode) =>
    render(
      <Provider store={store}>
        <ContextProvider>{children}</ContextProvider>
      </Provider>
    );

  it('should render without crashing', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue(null);
    renderWithProviders(<div>Test</div>);
  });

  it('provides correct UserContext values', () => {
    renderWithProviders(
      <UserContext.Consumer>
        {(value) => (
          <div data-testid='user-context'>{JSON.stringify(value)}</div>
        )}
      </UserContext.Consumer>
    );

    const userContext = screen.getByTestId('user-context');
    const userValue = JSON.parse(userContext.textContent || '{}');

    console.log(userContext);
    console.log(userValue);

    expect(userValue.user_id).toEqual('user123');
    expect(userValue.user).toEqual({ id: 'user123', name: 'Test User' });
    expect(userValue.isLoading).toBe(false);
    expect(userValue.error).toBe(null);
  });

  it('provides correct TaskContext values', () => {
    renderWithProviders(
      <TaskContext.Consumer>
        {(value) => (
          <div data-testid='task-context'>{JSON.stringify(value)}</div>
        )}
      </TaskContext.Consumer>
    );

    const taskContext = screen.getByTestId('task-context');
    const taskValue = JSON.parse(taskContext.textContent || '{}');

    expect(taskValue.tasks).toEqual([
      { id: 'task1', netIncome: 50 },
      { id: 'task2', netIncome: 100 },
      { id: 'task3', netIncome: 200 }
    ]);
    expect(taskValue.dailyTasks).toEqual([{ id: 'task1', netIncome: 50 }]);
    expect(taskValue.monthlyTasks).toEqual([
      { id: 'task1', netIncome: 50 },
      { id: 'task2', netIncome: 100 }
    ]);
    expect(taskValue.isLoading).toBe(false);
    expect(taskValue.error).toBe(null);
  });

  it('provides correct EarningsContext values', () => {
    renderWithProviders(
      <EarningsContext.Consumer>
        {(value) => (
          <div data-testid='earnings-context'>{JSON.stringify(value)}</div>
        )}
      </EarningsContext.Consumer>
    );

    const earningsContext = screen.getByTestId('earnings-context');
    const earningsValue = JSON.parse(earningsContext.textContent || '{}');

    expect(earningsValue.dailyTasksEarnings).toEqual(50);
    expect(earningsValue.monthlyTasksEarnings).toEqual(150);
    expect(earningsValue.isLoading).toBe(false);
    expect(earningsValue.error).toBe(null);
  });

  it('provides correct DailyGoalsContext values', () => {
    renderWithProviders(
      <DailyGoalsContext.Consumer>
        {(value) => (
          <div data-testid='daily-goals-context'>{JSON.stringify(value)}</div>
        )}
      </DailyGoalsContext.Consumer>
    );

    const dailyGoalsContext = screen.getByTestId('daily-goals-context');
    const dailyGoalsValue = JSON.parse(dailyGoalsContext.textContent || '{}');

    expect(dailyGoalsValue.dailyGoals).toEqual([{ id: 'goal1', value: 10 }]);
    expect(dailyGoalsValue.dailyTotalGoals).toEqual(10);
    expect(dailyGoalsValue.isLoading).toBe(false);
    expect(dailyGoalsValue.error).toBe(null);
  });

  it('provides correct MonthlyGoalsContext values', () => {
    renderWithProviders(
      <MonthlyGoalsContext.Consumer>
        {(value) => (
          <div data-testid='monthly-goals-context'>{JSON.stringify(value)}</div>
        )}
      </MonthlyGoalsContext.Consumer>
    );

    const monthlyGoalsContext = screen.getByTestId('monthly-goals-context');
    const monthlyGoalsValue = JSON.parse(
      monthlyGoalsContext.textContent || '{}'
    );
    expect(monthlyGoalsValue.monthlyGoals).toEqual([
      { id: 'goal2', value: 20 }
    ]);
    expect(monthlyGoalsValue.monthlyTotalGoals).toEqual(20);
    expect(monthlyGoalsValue.isLoading).toBe(false);
    expect(monthlyGoalsValue.error).toBe(null);
  });

  it('provides correct DateContext values', () => {
    renderWithProviders(
      <DateContext.Consumer>
        {(value) => (
          <div data-testid='date-context'>{JSON.stringify(value)}</div>
        )}
      </DateContext.Consumer>
    );

    const dateContext = screen.getByTestId('date-context');
    const dateValue = JSON.parse(dateContext.textContent || '{}');

    expect(dateValue.todaysDate).toEqual('');
    expect(dateValue.selectedDate).toEqual('');
  });

  it('fetches data on user change', async () => {
    renderWithProviders(<div />);

    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: expect.stringContaining('fetchTasks')
        }),
        expect.objectContaining({
          type: expect.stringContaining('fetchDailyGoals')
        }),
        expect.objectContaining({
          type: expect.stringContaining('fetchMonthlyGoals')
        })
      ])
    );
  });

  it('correctly handles earningsChange callback', () => {
    renderWithProviders(
      <EarningsContext.Consumer>
        {(value) => (
          <div>
            <div
              data-testid='earnings-context'
              data-context={JSON.stringify(value)}
            />
            <button
              onClick={() => value.earningsChange(20)}
              data-testid='earnings-button'
            >
              Change Earnings
            </button>
          </div>
        )}
      </EarningsContext.Consumer>
    );

    // Verify initial context value
    const contextElement = screen.getByTestId('earnings-context');
    const initialContextValue = JSON.parse(contextElement.textContent || '{}');
    expect(initialContextValue.dailyTasksEarnings).toBe(50);
    expect(initialContextValue.dailyTotalEarnings).toBe(50);

    // Simulate button click
    const button = screen.getByTestId('earnings-button');
    button.click();

    // Verify context value after callback
    const updatedContextValue = JSON.parse(contextElement.textContent || '{}');
    expect(updatedContextValue.dailyTotalEarnings).toBe(70); // Updated value after `earningsChange`
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  it('should fetch data when user and user_id are available', async () => {
    (reactRedux.useSelector as unknown as jest.Mock)
      .mockReturnValueOnce('user123') // user_id
      .mockReturnValueOnce({ id: 'user123' }); // user

    (tasksThunks.fetchTasks as unknown as jest.Mock).mockReturnValue({
      then: () => Promise.resolve()
    });
    (dailyGoalsThunks.fetchDailyGoals as unknown as jest.Mock).mockReturnValue({
      then: () => Promise.resolve()
    });
    (
      monthlyGoalsThunks.fetchMonthlyGoals as unknown as jest.Mock
    ).mockReturnValue({ then: () => Promise.resolve() });

    renderWithProviders(<div>Test</div>);

    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(tasksThunks.fetchTasks).toHaveBeenCalledWith({ user_id: 'user123' });
    expect(dailyGoalsThunks.fetchDailyGoals).toHaveBeenCalledWith({
      user_id: 'user123'
    });
    expect(monthlyGoalsThunks.fetchMonthlyGoals).toHaveBeenCalledWith({
      user_id: 'user123'
    });
  });

  it('should handle null tasks and goals', () => {
    (reactRedux.useSelector as unknown as jest.Mock)
      .mockReturnValueOnce('user123') // user_id
      .mockReturnValueOnce({ id: 'user123' }) // user
      .mockReturnValueOnce(null) // tasks
      .mockReturnValueOnce(null) // dailyTasks
      .mockReturnValueOnce(null) // monthlyTasks
      .mockReturnValueOnce(null) // dailyGoals
      .mockReturnValueOnce(null); // monthlyGoals

    renderWithProviders(<div>Test</div>);

    // Assert that the component doesn't crash with null values
  });

  it('should handle empty arrays for tasks and goals', () => {
    (reactRedux.useSelector as unknown as jest.Mock)
      .mockReturnValueOnce('user123') // user_id
      .mockReturnValueOnce({ id: 'user123' }) // user
      .mockReturnValueOnce([]) // tasks
      .mockReturnValueOnce([]) // dailyTasks
      .mockReturnValueOnce([]) // monthlyTasks
      .mockReturnValueOnce([]) // dailyGoals
      .mockReturnValueOnce([]); // monthlyGoals

    renderWithProviders(<div>Test</div>);

    // Assert that the component doesn't crash with empty arrays
  });

  it('should handle fetch failures', async () => {
    (reactRedux.useSelector as unknown as jest.Mock)
      .mockReturnValueOnce('user123') // user_id
      .mockReturnValueOnce({ id: 'user123' }); // user

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => null);

    (tasksThunks.fetchTasks as unknown as jest.Mock).mockReturnValue({
      then: () => Promise.reject('Error fetching tasks')
    });
    (dailyGoalsThunks.fetchDailyGoals as unknown as jest.Mock).mockReturnValue({
      then: () => Promise.reject('Error fetching daily goals')
    });
    (
      monthlyGoalsThunks.fetchMonthlyGoals as unknown as jest.Mock
    ).mockReturnValue({
      then: () => Promise.reject('Error fetching monthly goals')
    });

    renderWithProviders(<div>Test</div>);

    expect(consoleSpy).toHaveBeenCalledTimes(3);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch tasks:',
      'Error fetching tasks'
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch daily goals:',
      'Error fetching daily goals'
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch monthly goals:',
      'Error fetching monthly goals'
    );

    consoleSpy.mockRestore();
  });

  it('should calculate totals correctly with valid data', () => {
    (reactRedux.useSelector as unknown as jest.Mock)
      .mockReturnValueOnce('user123') // user_id
      .mockReturnValueOnce({ id: 'user123' }) // user
      .mockReturnValueOnce([
        { id: '1', netIncome: 100 },
        { id: '2', netIncome: 200 }
      ]) // tasks
      .mockReturnValueOnce([{ id: '1', netIncome: 100 }]) // dailyTasks
      .mockReturnValueOnce([
        { id: '1', netIncome: 100 },
        { id: '2', netIncome: 200 }
      ]) // monthlyTasks
      .mockReturnValueOnce([
        { id: '1', value: 50 },
        { id: '2', value: 75 }
      ]) // dailyGoals
      .mockReturnValueOnce([
        { id: '1', value: 500 },
        { id: '2', value: 750 }
      ]); // monthlyGoals

    renderWithProviders(<div>Test</div>);

    // You might need to add some way to access the context values here to assert the calculations
  });

  it('should handle failed data fetching', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => null);

    (tasksThunks.fetchTasks as unknown as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch tasks')
    );
    (
      dailyGoalsThunks.fetchDailyGoals as unknown as jest.Mock
    ).mockRejectedValue(new Error('Failed to fetch daily goals'));
    (
      monthlyGoalsThunks.fetchMonthlyGoals as unknown as jest.Mock
    ).mockRejectedValue(new Error('Failed to fetch monthly goals'));

    renderWithProviders(<div>Test Child</div>);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch tasks:',
      expect.any(Error)
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch daily goals:',
      expect.any(Error)
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to fetch monthly goals:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle null values in calculations', () => {
    const stateWithNullValues = {
      ...initialState,
      tasks: {
        ...initialState.tasks,
        entities: {
          '1': { id: '1', netIncome: null },
          '2': { id: '2', netIncome: 100 }
        },
        ids: ['1', '2']
      },
      dailyGoals: {
        ...initialState.dailyGoals,
        entities: {
          '1': { id: '1', value: null },
          '2': { id: '2', value: 50 }
        },
        ids: ['1', '2']
      }
    };

    const storeWithNullValues = mockStore(stateWithNullValues);

    render(
      <Provider store={storeWithNullValues}>
        <ContextProvider>
          <div>Test Child</div>
        </ContextProvider>
      </Provider>
    );

    // You might need to add some assertions here to check if the calculations are correct
    // This depends on how you expose the calculated values (e.g., through a test-only method or by rendering them)
  });

  it('should handle empty arrays in calculations', () => {
    const stateWithEmptyArrays = {
      ...initialState,
      tasks: {
        ...initialState.tasks,
        ids: [],
        entities: {}
      },
      dailyGoals: {
        ...initialState.dailyGoals,
        ids: [],
        entities: {}
      }
    };

    const storeWithEmptyArrays = mockStore(stateWithEmptyArrays);

    render(
      <Provider store={storeWithEmptyArrays}>
        <ContextProvider>
          <div>Test Child</div>
        </ContextProvider>
      </Provider>
    );

    // Add assertions to check if calculations with empty arrays are handled correctly
  });
});
