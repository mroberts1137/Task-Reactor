import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import axios from '../api/axios';
import { fetchTasks } from '../app/tasksThunks';
import { TASKS_URL } from '../api/api_urls';

jest.mock('../api/axios', () => ({
  get: jest.fn()
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const user_id = '123';
const mockData = { data: [{ id: 1, task: 'Test Task' }] };
const initialState = {
  tasks: [],
  status: 'idle',
  error: null
};
let store;

describe('fetchTasks async thunk', () => {
  beforeEach(() => {
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
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    await store.dispatch(fetchTasks(user_id));

    const actions = store.getActions();
    expect(actions[0].type).toBe('tasks/fetchTasks/pending');
    expect(actions[1].type).toBe('tasks/fetchTasks/rejected');
    expect(actions[1].error.message).toBe('Network Error');
    expect(axios.get).toHaveBeenCalledWith(
      TASKS_URL.replace('{userId}', user_id),
      expect.any(Object)
    );
  });
});
