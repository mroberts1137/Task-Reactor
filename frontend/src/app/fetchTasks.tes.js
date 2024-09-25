import axios from '../api/axios';
import configureStore from 'redux-mock-store';
// import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import tasksReducer, {
  fetchTasks,
  addTask,
  getTaskById,
  updateTaskById,
  removeTaskById
} from './tasksSlice';

// jest.mock('../api/axios');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('tasksSlice', () => {
  const initialState = {
    taskArray: [],
    status: 'idle',
    error: null
  };

  it('should handle fetchTasks.pending', () => {
    const action = { type: fetchTasks.pending.type };
    const state = tasksReducer(initialState, action);
    expect(state).toEqual({ ...initialState, status: 'loading' });
  });

  it('should handle fetchTasks.fulfilled', () => {
    const tasks = [
      { id: 1, name: 'Task 1' },
      { id: 2, name: 'Task 2' }
    ];
    const action = { type: fetchTasks.fulfilled.type, payload: tasks };
    const state = tasksReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      status: 'succeeded',
      taskArray: tasks
    });
  });

  it('should handle fetchTasks.rejected', () => {
    const errorMessage = 'Network Error';
    const action = {
      type: fetchTasks.rejected.type,
      error: { message: errorMessage }
    };
    const state = tasksReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      status: 'failed',
      error: errorMessage
    });
  });

  // Add similar tests for addTask, getTaskById, updateTaskById, and removeTaskById
});

describe('fetchTasks', () => {
  const user_id = '123';
  const tasks = [
    { id: 1, name: 'Task 1' },
    { id: 2, name: 'Task 2' }
  ];
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: tasks });
  });

  it('should handle fetchTasks.pending', async () => {
    const store = mockStore({
      tasks: { taskArray: [], status: 'idle', error: null }
    });

    await store.dispatch(fetchTasks(user_id));

    const actions = store.getActions();

    expect(actions[0]).toEqual({ type: fetchTasks.pending.type });
  });

  it('should handle fetchTasks.fulfilled', async () => {
    const store = mockStore({
      tasks: { taskArray: [], status: 'idle', error: null }
    });

    await store.dispatch(fetchTasks(user_id));
    const actions = store.getActions();
    expect(actions[1]).toEqual({
      type: fetchTasks.fulfilled.type,
      payload: tasks
    });
  });

  it('should handle fetchTasks.rejected', async () => {
    const store = mockStore({
      tasks: { taskArray: [], status: 'idle', error: null }
    });
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(fetchTasks(user_id));
    const actions = store.getActions();

    expect(actions[1]).toEqual({
      type: fetchTasks.rejected.type,
      error: { message: errorMessage }
    });
  });
});

describe('addTask', () => {
  const user_id = '123';
  const task = { name: 'Task 1' };
  const addedTask = { id: 3, ...task };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: addedTask });
  });

  it('should handle addTask.pending', async () => {
    const store = mockStore({
      tasks: { taskArray: [], status: 'idle', error: null }
    });

    await store.dispatch(addTask({ user_id, task }));
    const actions = store.getActions();

    expect(actions[0]).toEqual({ type: addTask.pending.type });
  });

  it('should handle addTask.fulfilled', async () => {
    const store = mockStore({
      tasks: { taskArray: [], status: 'idle', error: null }
    });

    await store.dispatch(addTask({ user_id, task }));
    const actions = store.getActions();

    expect(actions[1]).toEqual({
      type: addTask.fulfilled.type,
      payload: addedTask
    });
  });

  it('should handle addTask.rejected', async () => {
    const store = mockStore({
      tasks: { taskArray: [], status: 'idle', error: null }
    });
    const errorMessage = 'Network Error';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(addTask({ user_id, task }));
    const actions = store.getActions();

    expect(actions[1]).toEqual({
      type: addTask.rejected.type,
      error: { message: errorMessage }
    });
  });
});
