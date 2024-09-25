import tasksReducer, { initialState } from './tasksSlice';
import {
  fetchTasks,
  addTask,
  getTaskById,
  updateTaskById,
  removeTaskById
} from './tasksThunks';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import axios from 'axios';

jest.mock('axios');

// Mock localStorage for tests
// beforeAll(() => {
//   global.localStorage = {
//     getItem: jest.fn(() => 'mocked-jwt-token'),
//     setItem: jest.fn(),
//     clear: jest.fn(),
//     removeItem: jest.fn()
//   };
// });

describe('tasksSlice async thunks', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { tasks: tasksReducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware() // no need to add thunk here
    });
  });

  test('fetchTasks pending', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const action = fetchTasks.pending('requestId', { user_id: '123' });
    store.dispatch(action);

    const state = store.getState().tasks;
    expect(state.status).toBe('loading');
  });

  test('fetchTasks fulfilled', async () => {
    const mockData = [{ id: 1, title: 'Test Task' }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    await store.dispatch(fetchTasks('123'));

    const state = store.getState().tasks;
    expect(state.status).toBe('succeeded');
    expect(state.taskArray).toEqual(mockData);
  });

  test('fetchTasks rejected', async () => {
    const mockError = { message: 'Request failed' };
    axios.get.mockRejectedValueOnce(mockError);

    await store.dispatch(fetchTasks('123'));

    const state = store.getState().tasks;
    expect(state.status).toBe('failed');
    expect(state.error).toBe(mockError.message);
  });

  // Add similar tests for addTask, getTaskById, updateTaskById, and removeTaskById
});

describe('Tasks Reducer', () => {
  it('should handle fetchTasks.pending', () => {
    const action = { type: fetchTasks.pending.type };
    const newState = tasksReducer(initialState, action);
    expect(newState.status).toEqual('loading');
  });

  it('should handle fetchTasks.fulfilled', () => {
    const tasksData = [{ id: 1, name: 'Task 1' }];
    const action = { type: fetchTasks.fulfilled.type, payload: tasksData };
    const newState = tasksReducer(initialState, action);
    expect(newState.status).toEqual('succeeded');
    expect(newState.taskArray).toEqual(tasksData);
  });

  it('should handle fetchTasks.rejected', () => {
    const action = {
      type: fetchTasks.rejected.type,
      error: { message: 'Error fetching tasks' }
    };
    const newState = tasksReducer(initialState, action);
    expect(newState.status).toEqual('failed');
    expect(newState.error).toEqual('Error fetching tasks');
  });

  // Similar tests for addTask, getTaskById, updateTaskById, and removeTaskById
});

describe('Tasks Reducer - addTask', () => {
  it('should handle addTask.pending', () => {
    const action = { type: addTask.pending.type };
    const newState = tasksReducer(initialState, action);
    expect(newState.status).toEqual('loading');
  });

  it('should handle addTask.fulfilled', () => {
    const newTask = { id: 2, name: 'New Task' };
    const action = { type: addTask.fulfilled.type, payload: newTask };
    const newState = tasksReducer(initialState, action);
    expect(newState.status).toEqual('succeeded');
    expect(newState.taskArray).toEqual([newTask]);
  });

  it('should handle addTask.rejected', () => {
    const action = {
      type: addTask.rejected.type,
      error: { message: 'Error adding task' }
    };
    const newState = tasksReducer(initialState, action);
    expect(newState.status).toEqual('failed');
    expect(newState.error).toEqual('Error adding task');
  });
});

// import configureMockStore from 'redux-mock-store'; // Mock store
// import thunk from 'redux-thunk'; // Middleware for handling async actions
// import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
// import { fetchTasks } from './tasksThunks';
// import { TASKS_URL } from '../api/api_urls';

// const middlewares = [thunk];
// const mockStore = configureMockStore(middlewares);
// const mock = new MockAdapter(axios);

// describe('fetchTasks async thunk', () => {
//   let store;

//   // Set up a fresh store for each test
//   beforeEach(() => {
//     store = mockStore({
//       taskArray: [],
//       status: 'idle',
//       error: null
//     });
//   });

//   afterEach(() => {
//     mock.reset(); // Reset axios mock after each test
//   });

//   test('dispatches fetchTasks.pending and fetchTasks.fulfilled on successful fetch', async () => {
//     const userId = '123';
//     const mockTasks = [{ id: 1, title: 'Test Task' }];
//     const url = TASKS_URL.replace('{userId}', userId);

//     // Mocking the GET request to return success with mock data
//     mock.onGet(url).reply(200, mockTasks);

//     // Dispatch the thunk
//     await store.dispatch(fetchTasks(userId));

//     const actions = store.getActions(); // Get all dispatched actions

//     // Check if fetchTasks.pending is dispatched first
//     expect(actions[0].type).toEqual(fetchTasks.pending.type);

//     // Check if fetchTasks.fulfilled is dispatched with the correct payload
//     expect(actions[1].type).toEqual(fetchTasks.fulfilled.type);
//     expect(actions[1].payload).toEqual(mockTasks);
//   });

//   test('dispatches fetchTasks.rejected on failed fetch', async () => {
//     const userId = '123';
//     const url = TASKS_URL.replace('{userId}', userId);

//     // Mocking the GET request to return an error
//     mock.onGet(url).reply(500);

//     // Dispatch the thunk
//     await store.dispatch(fetchTasks(userId));

//     const actions = store.getActions(); // Get all dispatched actions

//     // Check if fetchTasks.pending is dispatched first
//     expect(actions[0].type).toEqual(fetchTasks.pending.type);

//     // Check if fetchTasks.rejected is dispatched on error
//     expect(actions[1].type).toEqual(fetchTasks.rejected.type);
//     expect(actions[1].error.message).toBeTruthy(); // Ensure the error message exists
//   });
// });
