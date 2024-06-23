import { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { selectTasksByDate, removeTask } from '../../app/taskSlice';
import DateDisplay from '../DateDisplay';
import DropdownSelector from './DropdownSelector';
import AddTask from '../list/AddTask';
import List from '../list/List';
import { TaskContext, DateContext } from '../../contexts/context';
import { sumTotal } from '../../utils/functions';

const TaskBox = () => {
  const { selectedDate } = useContext(DateContext);
  const dailyTasks = useSelector((state) =>
    selectTasksByDate(state, selectedDate)
  );
  const total = sumTotal(dailyTasks);

  const [showKeys, setShowKeys] = useState({
    title: true,
    startTime: false,
    endTime: false,
    duration: false,
    rate: false,
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
        removeItem={removeTask}
        displayKeys={displayKeys}
      />
    </div>
  );
};

export default TaskBox;
