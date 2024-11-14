import { Task } from '../types/types';
import { persistStore } from 'redux-persist';
import { store } from '../app/store';
import { useSelector } from 'react-redux';
import { selectAllTasks } from '../app/tasksSlice';
import { selectUser, selectUserId } from '../app/userSlice';

const DebugPanel = () => {
  const user_id = useSelector(selectUserId);
  const user = useSelector(selectUser);
  const tasks = useSelector(selectAllTasks);

  const handlePurgePersistStore = () => {
    // To purge all persisted data
    persistStore(store).purge();
  };

  return (
    <div>
      <button onClick={handlePurgePersistStore}>Purge Persist Store</button>
      <h2>User: {user?.username}</h2>
      <h2>Email: {user?.email}</h2>
      <h2>User ID: {user_id}</h2>
      <h1>Tasks:</h1>
      <ul>
        {tasks?.map((task: Task, index: number) => (
          <li key={index}>
            {JSON.stringify(task?.title)}' '{task?.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DebugPanel;
