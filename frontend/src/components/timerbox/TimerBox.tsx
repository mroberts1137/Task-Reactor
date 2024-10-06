import { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../app/tasksSlice';
import {
  EarningsContext,
  UserContext,
  UserContextType
} from '../../contexts/context';

import TaskTable from './TaskTable';
import TaskForm from './TaskForm';
import SavedTasks from './SavedTasks';
import './TimerBox.css';
import useInterval from '../../hooks/useInterval';
import { Task } from '../../types/types';
import { AppDispatch } from '../../app/store';
import { resetTask, updateTask } from '../../utils/time_box_functions';

const TimerBox: React.FC = () => {
  const [clockRunning, setClockRunning] = useState<boolean>(false);
  const [task, setTask] = useState<Task>(resetTask());
  const { user_id }: UserContextType = useContext(UserContext);
  const { earningsChange } = useContext(EarningsContext);

  const dispatch = useDispatch<AppDispatch>();

  useInterval(() => setTask(updateTask(task)), clockRunning ? 1000 : null);

  useEffect(() => {
    earningsChange(task?.netIncome || 0);
  }, [task?.netIncome, earningsChange]);

  const handleTaskSelect = (selectedTask: Task) => {
    setTask((prevTask) => ({ ...prevTask, ...selectedTask }));
  };

  const toggleClock = () => {
    if (clockRunning) {
      const endTime = new Date();
      const updatedTask = {
        ...updateTask(task),
        endTime
      };

      reset();

      if (user_id) {
        dispatch(addTask({ user_id, item: updatedTask }));
      } else {
        console.log('No user logged in');
      }
    } else {
      setTask({ ...task, startTime: new Date() });
    }
    setClockRunning(!clockRunning);
  };

  const reset = () => {
    setTask(resetTask());
  };

  return (
    <div className='container'>
      <h3 className='flex-row'>
        Current Task:{' '}
        {clockRunning ? (
          <p style={{ color: 'green', marginLeft: '20px' }}>Running...</p>
        ) : (
          <></>
        )}
      </h3>

      <TaskForm selectedTask={task} setTaskSelect={handleTaskSelect} />
      <SavedTasks onTaskSelect={handleTaskSelect} />

      <div className='flex-row'>
        <button
          className={clockRunning ? 'stop-btn' : 'start-btn'}
          onClick={toggleClock}
        >
          {clockRunning ? 'Stop' : 'Start'}
        </button>
        <button className='reset-btn' onClick={reset}>
          Reset
        </button>
      </div>

      <TaskTable task={task} clockRunning={clockRunning} />
    </div>
  );
};

export default TimerBox;
