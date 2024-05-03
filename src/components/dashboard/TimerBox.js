import { useState, useEffect, useRef } from 'react';
import { Button } from 'reactstrap';
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

const TimerBox = () => {
  const [clockRunning, setClockRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [earnings, setEarnings] = useState(0);
  const [rate, setRate] = useState(40);
  const [goalProgress, setGoalProgress] = useState(0);

  useInterval(updateElapsedTime, clockRunning ? 1000 : null);

  const toggleClock = () => {
    if (clockRunning) {
      setEndTime(new Date());
      updateElapsedTime();
      // trackList.push({
      //   startTime,
      //   endTime,
      //   elapsedTime,
      //   earnings
      // });
      // reset();
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

  function updateProgress() {
    // setGoalProgress((totalEarnings + earnings) / totalGoalValue);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = 'green';
    // ctx.fillRect(0, 0, parseInt(canvas.width * goalProgress), canvas.height);
    // document.querySelector('#progressPercent').innerText = Math.floor(goalProgress * 1000) / 10;
  }

  return (
    <div className='container'>
      <h3>Current Tasks: {clockRunning.toString()}</h3>
      <Button className='start-btn' onClick={toggleClock}>
        {clockRunning ? 'Stop' : 'Start'}
      </Button>
      <Button className='start-btn' onClick={reset}>
        Reset
      </Button>

      <div class='outputBlock'>
        <h2>
          Total Earnings: $<span id='totalEarnings'>0</span>
        </h2>
        <table id='trackList'>
          <tr>
            <th>Start Time:</th>
            <th>End Time:</th>
            <th>Elapsed Time:</th>
            <th>Earnings:</th>
          </tr>
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
            <td>${earnings}</td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default TimerBox;
