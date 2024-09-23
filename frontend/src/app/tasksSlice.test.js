import configureMockStore from 'redux-mock-store'; // Mock store
import thunk from 'redux-thunk'; // Middleware for handling async actions
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchTasks } from './taskSlice'; // Your async thunk
import { TASKS_URL } from '../api/api_urls'; // URL for tasks

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new MockAdapter(axios);

describe('fetchTasks async thunk', () => {
  let store;

  // Set up a fresh store for each test
  beforeEach(() => {
    store = mockStore({
      taskArray: [],
      status: 'idle',
      error: null
    });
  });

  afterEach(() => {
    mock.reset(); // Reset axios mock after each test
  });

  test('dispatches fetchTasks.pending and fetchTasks.fulfilled on successful fetch', async () => {
    const userId = '123';
    const mockTasks = [{ id: 1, title: 'Test Task' }];
    const url = TASKS_URL.replace('{userId}', userId);

    // Mocking the GET request to return success with mock data
    mock.onGet(url).reply(200, mockTasks);

    // Dispatch the thunk
    await store.dispatch(fetchTasks(userId));

    const actions = store.getActions(); // Get all dispatched actions

    // Check if fetchTasks.pending is dispatched first
    expect(actions[0].type).toEqual(fetchTasks.pending.type);

    // Check if fetchTasks.fulfilled is dispatched with the correct payload
    expect(actions[1].type).toEqual(fetchTasks.fulfilled.type);
    expect(actions[1].payload).toEqual(mockTasks);
  });

  test('dispatches fetchTasks.rejected on failed fetch', async () => {
    const userId = '123';
    const url = TASKS_URL.replace('{userId}', userId);

    // Mocking the GET request to return an error
    mock.onGet(url).reply(500);

    // Dispatch the thunk
    await store.dispatch(fetchTasks(userId));

    const actions = store.getActions(); // Get all dispatched actions

    // Check if fetchTasks.pending is dispatched first
    expect(actions[0].type).toEqual(fetchTasks.pending.type);

    // Check if fetchTasks.rejected is dispatched on error
    expect(actions[1].type).toEqual(fetchTasks.rejected.type);
    expect(actions[1].error.message).toBeTruthy(); // Ensure the error message exists
  });
});
