import { useState, useContext } from 'react';
import DateDisplay from '../DateDisplay';
import DropdownSelector from './DropdownSelector';
import List from '../list/List';
import { TaskContext, DateContext } from '../../contexts/context';
import { sumTotal } from '../../utils/functions';
import { Task } from '../../types/types';
import { formatCurrency } from '../../utils/time_box_functions';
import { removeTaskById } from '../../app/tasksThunks';

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
  hourlyRate: boolean;
  taxRate: boolean;
  grossIncome: boolean;
  netIncome: boolean;
}

const TaskBox: React.FC = () => {
  const { selectedDate } = useContext(DateContext);
  const { dailyTasks } = useContext(TaskContext);
  const total = sumTotal(dailyTasks?.map((item) => item.netIncome));

  const [showKeys, setShowKeys] = useState<ShowKeys>({
    title: true,
    startTime: true,
    endTime: true,
    duration: true,
    hourlyRate: true,
    taxRate: true,
    grossIncome: true,
    netIncome: true
  });

  const displayKeys: Record<keyof Omit<Task, 'id'>, DisplayKey> = {
    title: { name: 'Task', type: 'String', show: showKeys.title },
    startTime: { name: 'Start Time', type: 'Date', show: showKeys.startTime },
    endTime: { name: 'End Time', type: 'Date', show: showKeys.endTime },
    duration: { name: 'Duration', type: 'Duration', show: showKeys.duration },
    hourlyRate: { name: 'Rate', type: 'Currency', show: showKeys.hourlyRate },
    taxRate: { name: 'Tax', type: 'String', show: showKeys.taxRate },
    grossIncome: {
      name: 'Goss Income',
      type: 'Currency',
      show: showKeys.grossIncome
    },
    netIncome: {
      name: 'Net Income',
      type: 'Currency',
      show: showKeys.netIncome
    }
  };

  const toggleShowKey = (key: keyof ShowKeys) => {
    setShowKeys((prevShowKeys) => ({
      ...prevShowKeys,
      [key]: !prevShowKeys[key]
    }));
  };

  return (
    <div className='container'>
      <DateDisplay date={selectedDate} />
      <h3>
        Completed Tasks: <span id='goals-total'>{formatCurrency(total)}</span>
      </h3>
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
