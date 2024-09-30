import tasksReducer, {
  TasksState,
  initialState,
  setTasks,
  reset
} from '../app/tasksSlice';
import {
  fetchTasks,
  addTask,
  getTaskById,
  updateTaskById,
  removeTaskById
} from '../app/tasksThunks';
import { Task } from '../types/types';

jest.mock('../api/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

/**
 * tasksSlice
 */
describe('tasksSlice', () => {
  it('should handle initial state', () => {
    expect(tasksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setTasks', () => {
    const tasks: Task[] = [{ _id: '1', task: 'Task 1' }];
    const action = setTasks(tasks);
    const state = tasksReducer(initialState, action);

    expect(state.taskArray).toEqual(tasks);
    expect(state.status).toBe('idle');
    expect(state.error).toBeNull();
  });

  it('should handle reset', () => {
    const stateWithTasks: TasksState = {
      taskArray: [{ id: '1', task: 'Task 1' }],
      status: 'succeeded',
      error: 'Error'
    };
    const action = reset();
    const state = tasksReducer(stateWithTasks, action);

    expect(state).toEqual(initialState);
  });
});

/**
 * fetchTasks
 */
describe('tasksSlice fetchTasks', () => {
  it('should handle fetchTasks.pending', () => {
    const state: TasksState = { ...initialState, status: 'idle', error: null };
    const action = { type: fetchTasks.pending.type };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('loading');
  });

  it('should handle fetchTasks.fulfilled', () => {
    const mockTasks: Task[] = [
      { _id: '1', task: 'Task 1' },
      { _id: '2', task: 'Task 2' }
    ];
    const state: TasksState = {
      ...initialState,
      status: 'loading',
      error: null
    };
    const action = { type: fetchTasks.fulfilled.type, payload: mockTasks };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('succeeded');
    expect(newState.taskArray).toEqual(mockTasks);
  });

  it('should handle fetchTasks.rejected', () => {
    const state: TasksState = {
      ...initialState,
      status: 'loading',
      error: null
    };
    const action = {
      type: fetchTasks.rejected.type,
      error: { message: 'Error' }
    };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('failed');
    expect(newState.error).toBe('Error');
  });
});

/**
 * addTask
 */
describe('taskSlice addTask', () => {
  it('should handle addTask.pending', () => {
    const state: TasksState = { ...initialState, status: 'idle', error: null };
    const action = { type: addTask.pending.type };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('loading');
  });

  it('should handle addTask.fulfilled', () => {
    const mockTask: Task = { _id: '1', task: 'New Task' };
    const state: TasksState = {
      ...initialState,
      status: 'loading',
      error: null
    };
    const action = { type: addTask.fulfilled.type, payload: mockTask };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('succeeded');
    expect(newState.taskArray).toEqual([mockTask]);
  });

  it('should handle addTask.rejected', () => {
    const state: TasksState = {
      ...initialState,
      status: 'loading',
      error: null
    };
    const action = { type: addTask.rejected.type, error: { message: 'Error' } };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('failed');
    expect(newState.error).toBe('Error');
  });
});

/**
 * updateTaskById
 */
describe('taskSlice updateTaskById', () => {
  it('should handle updateTaskById.pending', () => {
    const state: TasksState = {
      ...initialState,
      status: 'idle',
      error: null
    };
    const action = { type: updateTaskById.pending.type };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('loading');
    expect(newState.error).toBeNull();
  });

  it('should handle updateTaskById.fulfilled', () => {
    const task: Task = { _id: '1', task: 'Task 1' };
    const state: TasksState = {
      ...initialState,
      taskArray: [task],
      status: 'loading',
      error: null
    };
    const updatedTask: Task = { ...task, task: 'Updated Task' };
    const action = {
      type: updateTaskById.fulfilled.type,
      payload: updatedTask
    };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('succeeded');
    expect(newState.taskArray).toContainEqual(updatedTask);
    expect(newState.error).toBeNull();
  });

  it('should handle updateTaskById.rejected', () => {
    const errorMessage = 'Error message';
    const action = {
      type: updateTaskById.rejected.type,
      error: { message: errorMessage }
    };
    const state = tasksReducer(initialState, action as any);
    expect(state.status).toBe('failed');
    expect(state.error).toBe(errorMessage);
  });
});

/**
 * getTaskById
 */
describe('taskSlice getTaskById', () => {
  it('should handle getTaskById.pending', () => {
    const state: TasksState = { ...initialState, status: 'idle', error: null };
    const action = { type: getTaskById.pending.type };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('loading');
  });

  it('should handle getTaskById.fulfilled', () => {
    const mockTask: Task = { _id: '1', task: 'Task 1' };
    const state: TasksState = {
      ...initialState,
      status: 'loading',
      error: null
    };
    const action = { type: getTaskById.fulfilled.type, payload: mockTask };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('succeeded');
    expect(newState.taskArray).toEqual([mockTask]);
  });

  it('should handle getTaskById.rejected', () => {
    const state: TasksState = {
      ...initialState,
      status: 'loading',
      error: null
    };
    const action = {
      type: getTaskById.rejected.type,
      error: { message: 'Error' }
    };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('failed');
    expect(newState.error).toBe('Error');
  });
});

/**
 * removeTaskById
 */
describe('taskSlice removeTaskById', () => {
  it('should handle removeTaskById.pending', () => {
    const state: TasksState = { ...initialState, status: 'idle', error: null };
    const action = { type: removeTaskById.pending.type };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('loading');
  });

  it('should handle removeTaskById.fulfilled', () => {
    const task1: Task = { _id: '1', task: 'Task 1' };
    const task2: Task = { _id: '2', task: 'Task 2' };
    const state: TasksState = {
      ...initialState,
      taskArray: [task1, task2],
      status: 'loading',
      error: null
    };
    const action = { type: removeTaskById.fulfilled.type, payload: task1 };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('succeeded');
    expect(newState.taskArray).toEqual([task2]);
  });

  it('should handle removeTaskById.rejected', () => {
    const state: TasksState = {
      ...initialState,
      status: 'loading',
      error: null
    };
    const action = {
      type: removeTaskById.rejected.type,
      error: { message: 'Error' }
    };
    const newState = tasksReducer(state, action);

    expect(newState.status).toBe('failed');
    expect(newState.error).toBe('Error');
  });
});
