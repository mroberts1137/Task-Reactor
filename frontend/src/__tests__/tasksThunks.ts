import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import axios from 'axios';
import {
  fetchTasks,
  addTask,
  getTaskById,
  updateTaskById,
  removeTaskById
} from '../app/tasksThunks';
import { tasksAdapter, TasksState } from '../app/tasksSlice';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  handleError: jest.fn((error) => error.message),
  isAxiosError: jest.fn(() => false)
}));

const middlewares = [thunk];
const mockStore = configureMockStore<TasksState>(middlewares);

describe('Task Thunks', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(
      tasksAdapter.getInitialState({
        status: 'idle',
        error: null
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks = [
        { _id: '1', title: 'Task 1' },
        { _id: '2', title: 'Task 2' }
      ];
      const returnedTasks = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' }
      ];
      (axios.get as jest.Mock).mockResolvedValue({
        data: mockTasks,
        statusText: 'OK'
      });

      await store.dispatch(fetchTasks({ user_id: 'user1' }) as any);
      const actions = store.getActions();

      expect(actions[0].type).toBe(fetchTasks.pending.type);
      expect(actions[1].type).toBe(fetchTasks.fulfilled.type);
      expect(actions[1].payload).toEqual(returnedTasks);
    });

    it('should handle fetchTasks failure', async () => {
      const errorMessage = 'Failed to fetch tasks';
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            message: errorMessage
          }
        },
        message: errorMessage
      };

      (axios.get as jest.Mock).mockRejectedValue(axiosError);

      await store.dispatch(fetchTasks({ user_id: 'user1' }) as any);
      const actions = store.getActions();

      expect(actions[0].type).toBe(fetchTasks.pending.type);
      expect(actions[1].type).toBe(fetchTasks.rejected.type);
      expect(actions[1].payload).toBe(errorMessage);
    });

    it('should handle fetchTasks with null response', async () => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: null,
        statusText: 'OK'
      });

      await store.dispatch(fetchTasks({ user_id: 'user1' }) as any);
      const actions = store.getActions();

      expect(actions[0].type).toBe(fetchTasks.pending.type);
      expect(actions[1].type).toBe(fetchTasks.fulfilled.type);
      expect(actions[1].payload).toEqual([]);
    });
  });

  describe('addTask', () => {
    it('should add a task successfully', async () => {
      const newTask = { id: '3', title: 'New Task' };
      const mockResponse = { _id: '3', ...newTask };
      (axios.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      await store.dispatch(addTask({ user_id: 'user1', item: newTask }) as any);
      const actions = store.getActions();

      expect(actions[0].type).toBe(addTask.pending.type);
      expect(actions[1].type).toBe(addTask.fulfilled.type);
      expect(actions[1].payload).toEqual({ id: '3', ...newTask });
    });

    it('should handle addTask failure', async () => {
      const errorMessage = 'Failed to add task';
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            message: errorMessage
          }
        },
        message: errorMessage
      };
      (axios.post as jest.Mock).mockRejectedValue(axiosError);
      const newTask = { id: undefined, title: 'New Task' };

      await store.dispatch(addTask({ user_id: 'user1', item: newTask }) as any);
      const actions = store.getActions();

      expect(actions[0].type).toBe(addTask.pending.type);
      expect(actions[1].type).toBe(addTask.rejected.type);
      expect(actions[1].payload).toBe(errorMessage);
    });
  });

  describe('getTaskById', () => {
    it('should get a task by id successfully', async () => {
      const mockTask = { _id: '1', title: 'Task 1' };
      (axios.get as jest.Mock).mockResolvedValue({ data: mockTask });

      await store.dispatch(
        getTaskById({ user_id: 'user1', item_id: '1' }) as any
      );
      const actions = store.getActions();

      expect(actions[0].type).toBe(getTaskById.pending.type);
      expect(actions[1].type).toBe(getTaskById.fulfilled.type);
      expect(actions[1].payload).toEqual({ id: '1', title: 'Task 1' });
    });

    it('should handle getTaskById failure', async () => {
      const errorMessage = 'Failed to get task';
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            message: errorMessage
          }
        },
        message: errorMessage
      };
      (axios.get as jest.Mock).mockRejectedValue(axiosError);

      await store.dispatch(
        getTaskById({ user_id: 'user1', item_id: '1' }) as any
      );
      const actions = store.getActions();

      expect(actions[0].type).toBe(getTaskById.pending.type);
      expect(actions[1].type).toBe(getTaskById.rejected.type);
      expect(actions[1].payload).toBe(errorMessage);
    });
  });

  describe('updateTaskById', () => {
    it('should update a task successfully', async () => {
      const updatedTask = { id: '1', title: 'Updated Task' };
      const mockResponse = { _id: '1', title: 'Updated Task' };
      (axios.put as jest.Mock).mockResolvedValue({ data: mockResponse });

      await store.dispatch(
        updateTaskById({
          user_id: 'user1',
          item_id: '1',
          updatedItem: updatedTask
        }) as any
      );
      const actions = store.getActions();

      expect(actions[0].type).toBe(updateTaskById.pending.type);
      expect(actions[1].type).toBe(updateTaskById.fulfilled.type);
      expect(actions[1].payload).toEqual(updatedTask);
    });

    it('should handle updateTaskById failure', async () => {
      const errorMessage = 'Failed to update task';
      (axios.put as jest.Mock).mockRejectedValue(new Error(errorMessage));
      const updatedItem = { id: '1', title: 'Updated Task' };

      await store.dispatch(
        updateTaskById({
          user_id: 'user1',
          item_id: '1',
          updatedItem: updatedItem
        }) as any
      );
      const actions = store.getActions();

      expect(actions[0].type).toBe(updateTaskById.pending.type);
      expect(actions[1].type).toBe(updateTaskById.rejected.type);
      expect(actions[1].payload).toBe(errorMessage);
    });
  });

  describe('removeTaskById', () => {
    it('should remove a task successfully', async () => {
      const mockResponse = { _id: '1', title: 'Removed Task' };
      (axios.delete as jest.Mock).mockResolvedValue({ data: mockResponse });

      await store.dispatch(
        removeTaskById({ user_id: 'user1', item_id: '1' }) as any
      );
      const actions = store.getActions();

      expect(actions[0].type).toBe(removeTaskById.pending.type);
      expect(actions[1].type).toBe(removeTaskById.fulfilled.type);
      expect(actions[1].payload).toEqual({ id: '1', title: 'Removed Task' });
    });

    it('should handle removeTaskById failure', async () => {
      const errorMessage = 'Failed to remove task';
      (axios.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await store.dispatch(
        removeTaskById({ user_id: 'user1', item_id: '1' }) as any
      );
      const actions = store.getActions();

      expect(actions[0].type).toBe(removeTaskById.pending.type);
      expect(actions[1].type).toBe(removeTaskById.rejected.type);
      expect(actions[1].payload).toBe(errorMessage);
    });
  });
});
