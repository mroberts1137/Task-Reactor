import { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { removeTaskById } from '../../app/tasksSlice';
import DateDisplay from '../DateDisplay';
import DropdownSelector from './DropdownSelector';
import AddTask from '../list/AddTask';
import List from '../list/List';
import { sumTotal } from '../../utils/functions';
import { formatCurrency } from '../../utils/time_box_functions';
import { DateContext, TaskContext } from '../../contexts/context';

const TaskBox = () => {
  const dispatch = useDispatch();
  const { selectedDate } = useContext(DateContext);
  const { dailyTasks } = useContext(TaskContext);
  const total = sumTotal(dailyTasks);

  const [showKeys, setShowKeys] = useState({
    title: true,
    startTime: true,
    endTime: true,
    duration: true,
    rate: true,
    value: true
  });

  const displayKeys = {
    title: { name: 'Task', type: 'String', show: showKeys.title },
    startTime: { name: 'Start Time', type: 'Date', show: showKeys.startTime },
    endTime: { name: 'End Time', type: 'Date', show: showKeys.endTime },
    duration: { name: 'Duration', type: 'Duration', show: showKeys.duration },
    rate: { name: 'Rate', type: 'Currency', show: showKeys.rate },
    value: { name: 'Value', type: 'Currency', show: showKeys.value }
  };

  const toggleShowKey = (key) => {
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
        Completed Tasks: <span id='goals-total'>{formatCurrency(total)}</span>
      </h3>
      <AddTask />
      <DropdownSelector
        items={Object.keys(showKeys)}
        selectedItems={showKeys}
        onToggle={toggleShowKey}
      />
      <List
        items={dailyTasks}
        removeAction={removeTaskById}
        displayKeys={displayKeys}
      />
    </div>
  );
};

export default TaskBox;