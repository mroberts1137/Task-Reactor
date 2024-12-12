import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import tasksReducer, { tasksAdapter } from '../../app/tasksSlice';
import {
  fetchTasks,
  addTask,
  getTaskById,
  updateTaskById,
  removeTaskById
} from '../../app/tasksThunks';

// Create a store factory
const makeStore = () => {
  return configureStore({
    reducer: {
      tasks: tasksReducer
    }
  });
};

describe('Task Thunks', () => {
  let store: ReturnType<typeof makeStore>;

  beforeEach(() => {
    store = makeStore();
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
      const expectedTasks = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' }
      ];

      (axios.get as jest.Mock).mockResolvedValue({
        data: mockTasks,
        statusText: 'OK'
      });

      await store.dispatch(fetchTasks({ user_id: 'user1' }));
      const state = store.getState().tasks;

      expect(state.status).toBe('succeeded');
      expect(tasksAdapter.getSelectors().selectAll(state)).toEqual(
        expectedTasks
      );
    });

    it('should handle fetchTasks failure', async () => {
      const errorMessage = 'Failed to fetch tasks';
      (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await store.dispatch(fetchTasks({ user_id: 'user1' }));
      const state = store.getState().tasks;

      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });

    it('should handle fetchTasks with null response', async () => {
      (axios.get as jest.Mock).mockResolvedValue({
        data: null,
        statusText: 'OK'
      });

      await store.dispatch(fetchTasks({ user_id: 'user1' }));
      const state = store.getState().tasks;

      expect(state.status).toBe('succeeded');
      expect(tasksAdapter.getSelectors().selectAll(state)).toEqual([]);
    });
  });

  describe('addTask', () => {
    it('should add a task successfully', async () => {
      const newTask = { id: '3', title: 'New Task' };
      const mockResponse = { _id: '3', ...newTask };

      (axios.post as jest.Mock).mockResolvedValue({ data: mockResponse });

      await store.dispatch(addTask({ user_id: 'user1', item: newTask }));
      const state = store.getState().tasks;

      expect(state.status).toBe('succeeded');
      expect(tasksAdapter.getSelectors().selectById(state, '3')).toEqual(
        newTask
      );
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

      await store.dispatch(addTask({ user_id: 'user1', item: newTask }));
      const state = store.getState().tasks;

      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getTaskById', () => {
    it('should get a task by id successfully', async () => {
      const mockTask = { _id: '1', title: 'Task 1' };
      const expectedTask = { id: '1', title: 'Task 1' };

      (axios.get as jest.Mock).mockResolvedValue({ data: mockTask });

      await store.dispatch(getTaskById({ user_id: 'user1', item_id: '1' }));
      const state = store.getState().tasks;

      expect(state.status).toBe('succeeded');
      expect(tasksAdapter.getSelectors().selectById(state, '1')).toEqual(
        expectedTask
      );
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

      await store.dispatch(getTaskById({ user_id: 'user1', item_id: '1' }));
      const state = store.getState().tasks;

      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('updateTaskById', () => {
    it('should update a task successfully', async () => {
      // First, add the initial task to the state
      const initialTask = { id: '1', title: 'Initial Task' };
      const mockAddResponse = { _id: '1', ...initialTask };
      (axios.post as jest.Mock).mockResolvedValue({ data: mockAddResponse });
      await store.dispatch(addTask({ user_id: 'user1', item: initialTask }));

      // Now update the task
      const updatedTask = { id: '1', title: 'Updated Task' };
      const mockUpdateResponse = { _id: '1', title: 'Updated Task' };
      (axios.put as jest.Mock).mockResolvedValue({ data: mockUpdateResponse });

      await store.dispatch(
        updateTaskById({
          user_id: 'user1',
          item_id: '1',
          updatedItem: updatedTask
        })
      );
      const state = store.getState().tasks;

      expect(state.status).toBe('succeeded');
      expect(tasksAdapter.getSelectors().selectById(state, '1')).toEqual(
        updatedTask
      );
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
        })
      );
      const state = store.getState().tasks;

      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('removeTaskById', () => {
    it('should remove a task successfully', async () => {
      // First add a task to remove
      const taskToRemove = { id: '1', title: 'Task to Remove' };

      // Mock successful fetch to add initial task
      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: [taskToRemove],
        statusText: 'OK'
      });

      // Fetch tasks to populate the store
      await store.dispatch(fetchTasks({ user_id: 'user1' }));

      const mockResponse = { _id: '1', title: 'Removed Task' };
      (axios.delete as jest.Mock).mockResolvedValue({ data: mockResponse });

      await store.dispatch(removeTaskById({ user_id: 'user1', item_id: '1' }));
      const state = store.getState().tasks;

      expect(state.status).toBe('succeeded');
      expect(
        tasksAdapter.getSelectors().selectById(state, '1')
      ).toBeUndefined();
    });

    it('should handle removeTaskById failure', async () => {
      const errorMessage = 'Failed to remove task';
      (axios.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await store.dispatch(removeTaskById({ user_id: 'user1', item_id: '1' }));
      const state = store.getState().tasks;

      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });
});
