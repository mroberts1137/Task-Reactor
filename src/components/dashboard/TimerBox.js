import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../app/taskReducer';
import './TimerBox.css';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const TimerBox = ({ earningsChange }) => {
  const [clockRunning, setClockRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [earnings, setEarnings] = useState(0);
  const [rate, setRate] = useState(40);
  const [taskName, setTaskName] = useState('');

  const dispatch = useDispatch();

  useInterval(updateElapsedTime, clockRunning ? 1000 : null);

  useEffect(() => {
    //this needs fixing. It shouldn't set(earnings) on updates of earnings -> endless loop
    earningsChange(earnings);
  }, [earnings]);

  const toggleClock = () => {
    if (clockRunning) {
      setEndTime(new Date());
      updateElapsedTime();
      const task = {
        title: taskName,
        startTime,
        endTime,
        duration: elapsedTime,
        value: earnings,
        rate
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
      Math.floor((elapsedTime / (1000 * 60 * 60)) * rate * 100) / 100
    );
  }

  function reset() {
    setClockRunning(false);
    setStartTime(null);
    setEndTime(null);
    setElapsedTime(null);
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
      <form>
        <label htmlFor='taskName'>Task: </label>
        <input
          type='text'
          onChange={(e) => setTaskName(e.target.value)}
          value={taskName}
          name='taskName'
        />
        <label htmlFor='rate'>Rate: $</label>
        <input
          type='text'
          onChange={(e) => setRate(e.target.value)}
          value={rate}
          name='rate'
        />
      </form>
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
                  {startTime.getHours()}:{startTime.getMinutes()}:
                  {startTime.getSeconds()}
                </td>
              ) : (
                <td>-</td>
              )}
              {endTime ? (
                <td>
                  {endTime.getHours()}:{endTime.getMinutes()}:
                  {endTime.getSeconds()}
                </td>
              ) : (
                <td>-</td>
              )}
              {elapsedTime ? (
                <td>
                  {Math.floor(elapsedTime / (1000 * 60 * 60))}:
                  {Math.floor(elapsedTime / (1000 * 60)) % 60}:
                  {Math.floor(elapsedTime / 1000) % 60}
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
