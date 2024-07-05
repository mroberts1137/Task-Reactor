import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../app/taskSlice';
import { saveTask } from '../../app/savedTasksSlice';
import TaskManager from './TaskManager';
import TaskForm from './TaskForm';
import SavedTasks from './SavedTasks';
import './TimerBox.css';

import useInterval from '../../hooks/useInterval';

const TimerBox = ({ earningsChange }) => {
  const [clockRunning, setClockRunning] = useState(false);
  const [startTime, setStartTime] = useState(undefined);
  const [endTime, setEndTime] = useState(undefined);
  const [elapsedTime, setElapsedTime] = useState(undefined);
  const [earnings, setEarnings] = useState(0);
  const [rate, setRate] = useState(40);
  const [taskName, setTaskName] = useState('');

  const dispatch = useDispatch();

  useInterval(updateElapsedTime, clockRunning ? 1000 : null);

  useEffect(() => {
    earningsChange(earnings);
  }, [earnings, earningsChange]);

  const toggleClock = () => {
    if (clockRunning) {
      setEndTime(new Date());
      updateElapsedTime();
      const task = {
        title: taskName,
        startTime,
        endTime: new Date(),
        duration: parseFloat(elapsedTime),
        value: parseFloat(earnings),
        rate: parseFloat(rate)
      };
      dispatch(addTask(task));
      reset();
    } else {
      setStartTime(new Date());
    }
    setClockRunning(!clockRunning);
  };

  function updateElapsedTime() {
    let currentTime = new Date();
    setElapsedTime(currentTime - startTime);
    setEarnings(
      Math.floor(((currentTime - startTime) / (1000 * 60 * 60)) * rate * 100) /
        100
    );
  }

  function reset() {
    setClockRunning(false);
    setStartTime(undefined);
    setEndTime(undefined);
    setElapsedTime(undefined);
    setEarnings(0);
  }

  // Model A

  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  // End Model A

  const handleSaveTask = () => {
    dispatch(saveTask({ task: taskName, rate }));
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

      {/* Model B */}
      {/* <TaskManager>
        {(task, setTask, rate, setRate) => (
          <div>
            <TaskForm />
            <SavedTasks />
          </div>
        )}
      </TaskManager> */}

      {/* Model A */}
      <TaskForm selectedTask={selectedTask} />
      <SavedTasks onTaskSelect={handleTaskSelect} />
      {/* End Model A */}

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
              {elapsedTime ? (
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
