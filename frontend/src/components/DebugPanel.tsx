import { useContext } from 'react';
import { TaskContext, UserContext } from '../contexts/context';
import { Task, User } from '../types/types';

const DebugPanel = () => {
  const { user, user_id }: { user: User; user_id: string } =
    useContext(UserContext);
  const { tasks }: { tasks: Task[] } = useContext(TaskContext);

  return (
    <div>
      <h2>User: {user?.username}</h2>
      <h2>Email: {user?.email}</h2>
      <h2>User ID: {user_id}</h2>
      <h1>Tasks:</h1>
      <ul>
        {tasks.map((task: Task, index: number) => (
          <li key={index}>
            {JSON.stringify(task?.title)}' '{task?._id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DebugPanel;
