import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import ContextProvider from '../contexts/ContextProvider';
import * as reactRedux from 'react-redux';
import * as tasksThunks from '../app/tasksThunks';
import * as dailyGoalsThunks from '../app/dailyGoalsThunks';
import * as monthlyGoalsThunks from '../app/monthlyGoalsThunks';

jest.mock('axios');

// Mock the redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

// Mock the thunks
jest.mock('../app/tasksThunks', () => ({
  fetchTasks: jest.fn()
}));
jest.mock('../app/dailyGoalsThunks', () => ({
  fetchDailyGoals: jest.fn()
}));
jest.mock('../app/monthlyGoalsThunks', () => ({
  fetchMonthlyGoals: jest.fn()
}));

const mockStore = configureStore([thunk]);

describe('ContextProvider', () => {
  let store;
  let mockDispatch;

  const initialState = {
    user: {
      user_id: 'test-user-id',
      user: { id: 'test-user-id', name: 'Test User' },
      status: 'idle',
      error: null
    },
    tasks: {
      ids: [],
      entities: {},
      status: 'idle',
      error: null
    },
    dailyGoals: {
      ids: [],
      entities: {},
      status: 'idle',
      error: null
    },
    monthlyGoals: {
      ids: [],
      entities: {},
      status: 'idle',
      error: null
    }
  };

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

  it('should render without crashing', () => {
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue(null);
    render(
      <Provider store={store}>
        <ContextProvider>
          <div>Test</div>
        </ContextProvider>
      </Provider>
    );
  });

  it('should fetch data when user and user_id are available', async () => {
    (reactRedux.useSelector as unknown as jest.Mock)
      .mockReturnValueOnce('user123') // user_id
      .mockReturnValueOnce({ id: 'user123' }); // user

    (tasksThunks.fetchTasks as unknown as jest.Mock).mockReturnValue({
      unwrap: () => Promise.resolve()
    });
    (dailyGoalsThunks.fetchDailyGoals as unknown as jest.Mock).mockReturnValue({
      unwrap: () => Promise.resolve()
    });
    (
      monthlyGoalsThunks.fetchMonthlyGoals as unknown as jest.Mock
    ).mockReturnValue({ unwrap: () => Promise.resolve() });

    await act(async () => {
      render(
        <Provider store={store}>
          <ContextProvider>
            <div>Test</div>
          </ContextProvider>
        </Provider>
      );
    });

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

    render(
      <Provider store={store}>
        <ContextProvider>
          <div>Test</div>
        </ContextProvider>
      </Provider>
    );

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

    render(
      <Provider store={store}>
        <ContextProvider>
          <div>Test</div>
        </ContextProvider>
      </Provider>
    );

    // Assert that the component doesn't crash with empty arrays
  });

  it('should handle fetch failures', async () => {
    (reactRedux.useSelector as unknown as jest.Mock)
      .mockReturnValueOnce('user123') // user_id
      .mockReturnValueOnce({ id: 'user123' }); // user

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (tasksThunks.fetchTasks as unknown as jest.Mock).mockReturnValue({
      unwrap: () => Promise.reject('Error fetching tasks')
    });
    (dailyGoalsThunks.fetchDailyGoals as unknown as jest.Mock).mockReturnValue({
      unwrap: () => Promise.reject('Error fetching daily goals')
    });
    (
      monthlyGoalsThunks.fetchMonthlyGoals as unknown as jest.Mock
    ).mockReturnValue({
      unwrap: () => Promise.reject('Error fetching monthly goals')
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <ContextProvider>
            <div>Test</div>
          </ContextProvider>
        </Provider>
      );
    });

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

    render(
      <Provider store={store}>
        <ContextProvider>
          <div>Test</div>
        </ContextProvider>
      </Provider>
    );

    // You might need to add some way to access the context values here to assert the calculations
  });

  it('should handle failed data fetching', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (tasksThunks.fetchTasks as unknown as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch tasks')
    );
    (
      dailyGoalsThunks.fetchDailyGoals as unknown as jest.Mock
    ).mockRejectedValue(new Error('Failed to fetch daily goals'));
    (
      monthlyGoalsThunks.fetchMonthlyGoals as unknown as jest.Mock
    ).mockRejectedValue(new Error('Failed to fetch monthly goals'));

    await act(async () => {
      render(
        <Provider store={store}>
          <ContextProvider>
            <div>Test Child</div>
          </ContextProvider>
        </Provider>
      );
    });

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
