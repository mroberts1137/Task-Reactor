import { useState } from 'react';
import { Button } from 'reactstrap';
import './TimerBox.css';

const TimerBox = () => {
  const [clockRunning, setClockRunning] = useState(false);
  const [startTime, setStartTime] = useState(new Date(0));
  const [endTime, setEndTime] = useState(new Date(0));
  const [elapsedTime, setElapsedTime] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [goalProgress, setGoalProgress] = useState(0);

  const toggleClock = () => {
    if (clockRunning) {
      // clearInterval(updateEarningsInterval);
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
      // updateEarningsInterval = setInterval(updateElapsedTime, 1000);
      setStartTime(new Date());
    }
    setClockRunning(!clockRunning);
  };

  function updateElapsedTime() {
    // let currentTime = new Date();
    // elapsedTime =
    //   Math.floor(((currentTime - startTime) / (1000 * 60 * 60)) * 100) / 100;
    // earnings = Math.floor(elapsedTime * rate * 100) / 100;

    // elapsedTimeEl.innerText = elapsedTime;
    // earningsEl.innerText = earnings;
    // updateProgress();
    setElapsedTime(
      Math.floor(((new Date() - startTime) / (1000 * 60)) * 1000) / 1000
    );
  }

  function reset() {
    // clearInterval(updateEarningsInterval);
    setStartTime(0);
    setEndTime(0);
    setElapsedTime(0);
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

      <div class='outputBlock'>
        <h2>
          Total Earnings: $<span id='totalEarnings'>0</span>
        </h2>
        <table id='trackList'>
          <tr>
            <th>
              Start Time: {startTime.getHours()}:{startTime.getMinutes()}:
              {startTime.getSeconds()}
            </th>
            <th>
              End Time: {endTime.getHours()}:{endTime.getMinutes()}:
              {endTime.getSeconds()}
            </th>
            <th>Elapsed Time (min): {elapsedTime.toString()}</th>
            <th>Earnings: ${earnings.toString()}</th>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default TimerBox;
