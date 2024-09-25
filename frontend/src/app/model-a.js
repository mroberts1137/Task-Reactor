import { configureStore } from '@reduxjs/toolkit';
import tasksReducer, { initialState } from './tasksSlice';
import {
  fetchTasks,
  addTask,
  getTaskById,
  updateTaskById,
  removeTaskById
} from './tasksThunks';

// Mock the async thunks
jest.mock('./tasksThunks', () => ({
  fetchTasks: jest.fn(),
  addTask: jest.fn(),
  getTaskById: jest.fn(),
  updateTaskById: jest.fn(),
  removeTaskById: jest.fn()
}));

describe('tasksSlice reducer', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        tasks: tasksReducer
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle fetchTasks.pending', async () => {
    fetchTasks.mockImplementation(() => (dispatch) => {
      dispatch(fetchTasks.pending());
    });

    await store.dispatch(fetchTasks());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'loading'
    });
  });

  it('should handle fetchTasks.fulfilled', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1' },
      { id: 2, title: 'Task 2' }
    ];
    fetchTasks.mockImplementation(() => (dispatch) => {
      dispatch(fetchTasks.fulfilled(mockTasks));
    });

    await store.dispatch(fetchTasks());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'succeeded',
      taskArray: mockTasks
    });
  });

  it('should handle fetchTasks.rejected', async () => {
    const mockError = 'Failed to fetch tasks';
    fetchTasks.mockImplementation(() => (dispatch) => {
      dispatch(fetchTasks.rejected(new Error(mockError)));
    });

    await store.dispatch(fetchTasks());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'failed',
      error: mockError
    });
  });

  it('should handle addTask.pending', async () => {
    addTask.mockImplementation(() => (dispatch) => {
      dispatch(addTask.pending());
    });

    await store.dispatch(addTask());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'loading'
    });
  });

  it('should handle addTask.fulfilled', async () => {
    const mockTask = { id: 3, title: 'Task 3' };
    addTask.mockImplementation(() => (dispatch) => {
      dispatch(addTask.fulfilled(mockTask));
    });

    await store.dispatch(addTask());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'succeeded',
      taskArray: [mockTask]
    });
  });

  it('should handle addTask.rejected', async () => {
    const mockError = 'Failed to add task';
    addTask.mockImplementation(() => (dispatch) => {
      dispatch(addTask.rejected(new Error(mockError)));
    });

    await store.dispatch(addTask());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'failed',
      error: mockError
    });
  });

  // Similarly, write tests for getTaskById, updateTaskById, and removeTaskById

  it('should handle getTaskById.pending', async () => {
    getTaskById.mockImplementation(() => (dispatch) => {
      dispatch(getTaskById.pending());
    });

    await store.dispatch(getTaskById());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'loading'
    });
  });

  it('should handle getTaskById.fulfilled', async () => {
    const mockTask = { id: 4, title: 'Task 4' };
    getTaskById.mockImplementation(() => (dispatch) => {
      dispatch(getTaskById.fulfilled(mockTask));
    });

    await store.dispatch(getTaskById());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'succeeded',
      taskArray: [mockTask]
    });
  });

  it('should handle getTaskById.rejected', async () => {
    const mockError = 'Failed to get task';
    getTaskById.mockImplementation(() => (dispatch) => {
      dispatch(getTaskById.rejected(new Error(mockError)));
    });

    await store.dispatch(getTaskById());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'failed',
      error: mockError
    });
  });

  it('should handle updateTaskById.pending', async () => {
    updateTaskById.mockImplementation(() => (dispatch) => {
      dispatch(updateTaskById.pending());
    });

    await store.dispatch(updateTaskById());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'loading'
    });
  });

  it('should handle updateTaskById.fulfilled', async () => {
    const mockTask = { id: 5, title: 'Updated Task' };
    updateTaskById.mockImplementation(() => (dispatch) => {
      dispatch(updateTaskById.fulfilled(mockTask));
    });

    const initialStateWithTask = {
      ...initialState,
      taskArray: [{ id: 5, title: 'Task 5' }]
    };
    store.setState({ tasks: initialStateWithTask });

    await store.dispatch(updateTaskById());

    expect(store.getState().tasks).toEqual({
      ...initialStateWithTask,
      status: 'succeeded',
      taskArray: [mockTask]
    });
  });

  it('should handle updateTaskById.rejected', async () => {
    const mockError = 'Failed to update task';
    updateTaskById.mockImplementation(() => (dispatch) => {
      dispatch(updateTaskById.rejected(new Error(mockError)));
    });

    await store.dispatch(updateTaskById());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'failed',
      error: mockError
    });
  });

  it('should handle removeTaskById.pending', async () => {
    removeTaskById.mockImplementation(() => (dispatch) => {
      dispatch(removeTaskById.pending());
    });

    await store.dispatch(removeTaskById());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'loading'
    });
  });

  it('should handle removeTaskById.fulfilled', async () => {
    const mockTaskId = 6;
    removeTaskById.mockImplementation(() => (dispatch) => {
      dispatch(removeTaskById.fulfilled({ id: mockTaskId }));
    });

    const initialStateWithTask = {
      ...initialState,
      taskArray: [{ id: 6, title: 'Task 6' }]
    };
    store.setState({ tasks: initialStateWithTask });

    await store.dispatch(removeTaskById());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'succeeded',
      taskArray: []
    });
  });

  it('should handle removeTaskById.rejected', async () => {
    const mockError = 'Failed to remove task';
    removeTaskById.mockImplementation(() => (dispatch) => {
      dispatch(removeTaskById.rejected(new Error(mockError)));
    });

    await store.dispatch(removeTaskById());

    expect(store.getState().tasks).toEqual({
      ...initialState,
      status: 'failed',
      error: mockError
    });
  });
});
