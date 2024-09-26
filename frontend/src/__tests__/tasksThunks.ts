import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import axios from '../api/axios';
import {
  fetchTasks,
  addTask,
  getTaskById,
  updateTaskById,
  removeTaskById
} from '../app/tasksThunks';
import { TASKS_URL } from '../api/api_urls';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../app/store';
import { TasksState } from '../app/tasksSlice';
import { Task } from '../types/tasks';

jest.mock('../api/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

const middlewares = [thunk];
const mockStore = configureMockStore<TasksState>(middlewares);

const initialState: TasksState = {
  taskArray: [],
  status: 'idle',
  error: null
};

let store: ReturnType<typeof mockStore>;

const user_id = '123';
const task_id = '456';
const mockTask: Task = { id: task_id, task: 'Test Task' };
const mockData = { data: mockTask };
const errorMessage = 'Network Error';

describe('fetchTasks', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    store = mockStore(initialState);
  });

  it('should dispatch fetchTasks.pending and fetchTasks.fulfilled on success', async () => {
    axios.get.mockResolvedValueOnce(mockData);

    await store.dispatch(fetchTasks(user_id));

    const actions = store.getActions();
    expect(actions[0].type).toBe('tasks/fetchTasks/pending');
    expect(actions[1].type).toBe('tasks/fetchTasks/fulfilled');
    expect(actions[1].payload).toEqual(mockData.data);
    expect(axios.get).toHaveBeenCalledWith(
      TASKS_URL.replace('{userId}', user_id),
      expect.any(Object)
    );
  });

  it('should dispatch fetchTasks.pending and fetchTasks.rejected on failure', async () => {
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(fetchTasks(user_id));

    const actions = store.getActions();
    expect(actions[0].type).toBe('tasks/fetchTasks/pending');
    expect(actions[1].type).toBe('tasks/fetchTasks/rejected');
    expect(actions[1].error.message).toEqual(errorMessage);
    expect(axios.get).toHaveBeenCalledWith(
      TASKS_URL.replace('{userId}', user_id),
      expect.any(Object)
    );
  });
});

describe('addTask', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    store = mockStore(initialState);
  });

  it('should dispatch addTask.pending and addTask.fulfilled on success', async () => {
    axios.post.mockResolvedValueOnce(mockData);

    await store.dispatch(addTask({ user_id, task: mockTask }));

    const actions = store.getActions();
    expect(actions[0].type).toBe('tasks/addTask/pending');
    expect(actions[1].type).toBe('tasks/addTask/fulfilled');
    expect(actions[1].payload).toEqual(mockData.data);
    expect(axios.post).toHaveBeenCalledWith(
      TASKS_URL.replace('{userId}', user_id),
      mockTask,
      expect.any(Object)
    );
  });

  it('should dispatch addTask.pending and addTask.rejected on failure', async () => {
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(addTask({ user_id, task: mockTask }));

    const actions = store.getActions();
    expect(actions[0].type).toBe('tasks/addTask/pending');
    expect(actions[1].type).toBe('tasks/addTask/rejected');
    expect(actions[1].error.message).toEqual(errorMessage);
    expect(axios.post).toHaveBeenCalledWith(
      TASKS_URL.replace('{userId}', user_id),
      mockTask,
      expect.any(Object)
    );
  });
});

describe('getTaskById', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    store = mockStore(initialState);
  });

  it('should dispatch getTaskById.pending and getTaskById.fulfilled on success', async () => {
    axios.get.mockResolvedValueOnce(mockData);

    await store.dispatch(getTaskById({ user_id, task_id }));

    const actions = store.getActions();
    expect(actions[0].type).toBe('tasks/getTaskById/pending');
    expect(actions[1].type).toBe('tasks/getTaskById/fulfilled');
    expect(actions[1].payload).toEqual(mockTask);
    expect(axios.get).toHaveBeenCalledWith(
      `${TASKS_URL.replace('{userId}', user_id)}/${task_id}`,
      expect.any(Object)
    );
  });

  it('should dispatch getTaskById.pending and getTaskById.rejected on failure', async () => {
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(getTaskById({ user_id, task_id }));

    const actions = store.getActions();
    expect(actions[0].type).toBe('tasks/getTaskById/pending');
    expect(actions[1].type).toBe('tasks/getTaskById/rejected');
    expect(actions[1].error.message).toEqual(errorMessage);
    expect(axios.get).toHaveBeenCalledWith(
      `${TASKS_URL.replace('{userId}', user_id)}/${task_id}`,
      expect.any(Object)
    );
  });
});

describe('updateTaskById', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    store = mockStore(initialState);
  });

  const mockUpdatedTask: Task = { id: task_id, task: 'Updated Task' };

  it('should dispatch updateTaskById.pending and updateTaskById.fulfilled on success', async () => {
    axios.put.mockResolvedValueOnce({ data: mockUpdatedTask });

    await store.dispatch(
      updateTaskById({ user_id, task_id, updatedTask: mockUpdatedTask })
    );

    const actions = store.getActions();
    expect(actions[0].type).toBe('tasks/updateTaskById/pending');
    expect(actions[1].type).toBe('tasks/updateTaskById/fulfilled');
    expect(actions[1].payload).toEqual(mockUpdatedTask);
    expect(axios.put).toHaveBeenCalledWith(
      `${TASKS_URL.replace('{userId}', user_id)}/${task_id}`,
      mockUpdatedTask,
      expect.any(Object)
    );
  });

  it('should dispatch updateTaskById.pending and updateTaskById.rejected on failure', async () => {
    axios.put.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(
      updateTaskById({ user_id, task_id, updatedTask: mockUpdatedTask })
    );

    const actions = store.getActions();
    expect(actions[0].type).toBe('tasks/updateTaskById/pending');
    expect(actions[1].type).toBe('tasks/updateTaskById/rejected');
    expect(actions[1].error.message).toEqual(errorMessage);
    expect(axios.put).toHaveBeenCalledWith(
      `${TASKS_URL.replace('{userId}', user_id)}/${task_id}`,
      mockUpdatedTask,
      expect.any(Object)
    );
  });
});

describe('removeTaskById', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
    store = mockStore(initialState);
  });

  it('should dispatch removeTaskById.pending and removeTaskById.fulfilled on success', async () => {
    axios.delete.mockResolvedValueOnce({ data: {} });

    await store.dispatch(removeTaskById({ user_id, task_id }));

    const actions = store.getActions();
    expect(actions[0].type).toBe('tasks/removeTaskById/pending');
    expect(actions[1].type).toBe('tasks/removeTaskById/fulfilled');
    expect(axios.delete).toHaveBeenCalledWith(
      `${TASKS_URL.replace('{userId}', user_id)}/${task_id}`,
      expect.any(Object)
    );
  });

  it('should dispatch removeTaskById.pending and removeTaskById.rejected on failure', async () => {
    axios.delete.mockRejectedValueOnce(new Error(errorMessage));

    await store.dispatch(removeTaskById({ user_id, task_id }));

    const actions = store.getActions();
    expect(actions[0].type).toBe('tasks/removeTaskById/pending');
    expect(actions[1].type).toBe('tasks/removeTaskById/rejected');
    expect(actions[1].error.message).toEqual(errorMessage);
    expect(axios.delete).toHaveBeenCalledWith(
      `${TASKS_URL.replace('{userId}', user_id)}/${task_id}`,
      expect.any(Object)
    );
  });
});
