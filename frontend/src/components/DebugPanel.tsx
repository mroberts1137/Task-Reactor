import { useContext } from 'react';
import { TaskContext, UserContext } from '../contexts/context';
import { Task, User } from '../types/types';
import { persistStore } from 'redux-persist';
import { store } from '../app/store';

const DebugPanel = () => {
  const { user, user_id }: { user: User; user_id: string } =
    useContext(UserContext);
  const { tasks }: { tasks: Task[] } = useContext(TaskContext);

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
