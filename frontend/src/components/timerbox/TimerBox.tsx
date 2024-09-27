import { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../app/tasksSlice';
import { saveTask } from '../../app/savedTasksSlice';
import { UserContext, UserContextType } from '../../contexts/context';
import TaskManager from './TaskManager';
import TaskForm from './TaskForm';
import SavedTasks from './SavedTasks';
import './TimerBox.css';
import useInterval from '../../hooks/useInterval';

import { Task } from '../../types/types';
import { AppDispatch } from '../../app/store';

interface SelectedTask {
  title: string;
  rate: number;
}

interface TimerBoxProps {
  earningsChange: (earnings: number) => void;
}

const TimerBox: React.FC<TimerBoxProps> = ({ earningsChange }) => {
  const [clockRunning, setClockRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const [elapsedTime, setElapsedTime] = useState<number | undefined>(undefined);
  const [earnings, setEarnings] = useState<number>(0);
  const [selectedTask, setSelectedTask] = useState<SelectedTask>({
    title: '',
    rate: 0
  });

  const { user, user_id }: UserContextType = useContext(UserContext);

  const dispatch = useDispatch<AppDispatch>();

  useInterval(updateElapsedTime, clockRunning ? 1000 : null);

  useEffect(() => {
    earningsChange(earnings);
  }, [earnings, earningsChange]);

  const handleTaskSelect = (task: SelectedTask) => {
    setSelectedTask(task);
  };

  const toggleClock = () => {
    if (clockRunning) {
      setEndTime(new Date());
      updateElapsedTime();

      const newTask = {
        title: selectedTask.title || 'N/A',
        startTime: startTime || new Date(),
        endTime: new Date(),
        duration: parseFloat(elapsedTime?.toString() || '0'),
        value: parseFloat(earnings.toString()) || 0,
        rate: parseFloat(selectedTask.rate.toString()) || 0
      };
      reset();

      if (!user_id) {
        console.log('No user logged in');
        return;
      }

      dispatch(addTask({ user_id, task: newTask }));
    } else {
      setStartTime(new Date());
    }
    setClockRunning(!clockRunning);
  };

  function updateElapsedTime() {
    if (startTime) {
      let currentTime = new Date();
      setElapsedTime(currentTime.getTime() - startTime.getTime());
      setEarnings(
        Math.floor(
          ((currentTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)) *
            selectedTask.rate *
            100
        ) / 100
      );
    }
  }

  function reset() {
    setClockRunning(false);
    setStartTime(undefined);
    setEndTime(undefined);
    setElapsedTime(undefined);
    setEarnings(0);
  }

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

      <TaskForm selectedTask={selectedTask} setTaskSelect={handleTaskSelect} />
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

      <div className='outputBlock'>
        <table id='trackList'>
          <thead>
            <tr>
              <th>Start Time:</th>
              <th>End Time:</th>
              <th>Elapsed Time:</th>
              <th>Earnings:</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {startTime ? (
                <td>
                  {startTime.getHours()}:
                  {startTime.getMinutes().toString().padStart(2, '0')}:
                  {startTime.getSeconds().toString().padStart(2, '0')}
                </td>
              ) : (
                <td>-</td>
              )}
              {endTime ? (
                <td>
                  {endTime.getHours()}:
                  {endTime.getMinutes().toString().padStart(2, '0')}:
                  {endTime.getSeconds().toString().padStart(2, '0')}
                </td>
              ) : (
                <td>-</td>
              )}
              {elapsedTime !== undefined ? (
                <td>
                  {Math.floor(elapsedTime / (1000 * 60 * 60))}:
                  {(Math.floor(elapsedTime / (1000 * 60)) % 60)
                    .toString()
                    .padStart(2, '0')}
                  :
                  {(Math.floor(elapsedTime / 1000) % 60)
                    .toString()
                    .padStart(2, '0')}
                </td>
              ) : (
                <td>-</td>
              )}
              <td>${earnings.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimerBox;
