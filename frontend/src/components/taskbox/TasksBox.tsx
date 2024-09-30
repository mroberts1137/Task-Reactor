import { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { removeTaskById } from '../../app/tasksSlice';
import DateDisplay from '../DateDisplay';
import DropdownSelector from './DropdownSelector';
import AddTask from '../list/AddTask';
import List from '../list/List';
import { TaskContext, DateContext, UserContext } from '../../contexts/context';
import { sumTotal } from '../../utils/functions';
import { Task } from '../../types/types';
import { AppDispatch } from '../../app/store';
import { UserIdItemIdPayload } from '../../types/payloads';

interface DisplayKey {
  name: string;
  type: 'String' | 'Date' | 'Duration' | 'Currency';
  show: boolean;
}

interface ShowKeys {
  title: boolean;
  startTime: boolean;
  endTime: boolean;
  duration: boolean;
  rate: boolean;
  value: boolean;
}

const TaskBox: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedDate } = useContext(DateContext);
  const { dailyTasks } = useContext(TaskContext);
  const total = sumTotal(dailyTasks);
  const { user_id } = useContext(UserContext);

  const [showKeys, setShowKeys] = useState<ShowKeys>({
    title: true,
    startTime: true,
    endTime: true,
    duration: true,
    rate: true,
    value: true
  });

  const displayKeys: Record<keyof Omit<Task, '_id'>, DisplayKey> = {
    title: { name: 'Task', type: 'String', show: showKeys.title },
    startTime: { name: 'Start Time', type: 'Date', show: showKeys.startTime },
    endTime: { name: 'End Time', type: 'Date', show: showKeys.endTime },
    duration: { name: 'Duration', type: 'Duration', show: showKeys.duration },
    rate: { name: 'Rate', type: 'Currency', show: showKeys.rate },
    value: { name: 'Value', type: 'Currency', show: showKeys.value }
  };

  const toggleShowKey = (key: keyof ShowKeys) => {
    setShowKeys((prevShowKeys) => ({
      ...prevShowKeys,
      [key]: !prevShowKeys[key]
    }));
  };

  const handleDelete = (payload) => {
    dispatch(removeTaskById(payload));
  };

  return (
    <div className='container'>
      <DateDisplay date={selectedDate} />
      <h3>
        Completed Tasks: $<span id='goals-total'>{total.toFixed(2)}</span>
      </h3>
      <AddTask />
      <DropdownSelector
        items={Object.keys(showKeys)}
        selectedItems={showKeys}
        onToggle={toggleShowKey}
      />
      <List
        items={dailyTasks}
        removeAction={handleDelete}
        displayKeys={displayKeys}
      />
    </div>
  );
};

export default TaskBox;
