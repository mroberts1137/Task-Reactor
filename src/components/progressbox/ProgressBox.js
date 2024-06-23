import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './ProgressBox.css';
import { selectAllGoals } from '../../app/goalsSlice';

const Progress = ({ totalEarnings, goalsTotal }) => {
  const goals = useSelector(selectAllGoals);
  const [progress, setProgress] = useState(0);
  const [goalLines, setGoalLines] = useState([]);

  useEffect(() => {
    setProgress(Math.floor((totalEarnings / goalsTotal) * 10000) / 100);

    let previousOffset = 0;
    const goalLinesValues = goals.map((goal) => {
      const goalValue = parseFloat(goal.value);
      const goalPercentage = (goalValue / goalsTotal) * 100;
      const offset = previousOffset;
      previousOffset += goalPercentage;

      return {
        offset,
        width: goalPercentage,
        value: goalValue
      };
    });
    setGoalLines(goalLinesValues);
  }, [totalEarnings, goalsTotal, goals]);

  return (
    <div className='container'>
      <h3>{progress}%</h3>
      <div className='progress-container'>
        <div className='info-col'>
          <h4>Total Earnings:</h4>
          <h4>${totalEarnings.toFixed(2)}</h4>
        </div>
        <div className='progress-bar'>
          {goalLines.map((goalLine, index) => (
            <div
              key={index}
              className={`goal-line ${
                progress >= goalLine.offset + goalLine.width ? 'exceeded' : ''
              }`}
              style={{
                left: `${goalLine.offset}%`,
                width: `${goalLine.width}%`
              }}
            >
              <span>${parseFloat(goalLine.value).toFixed(0)}</span>
            </div>
          ))}
          <div
            className='progress'
            style={{
              width: `${progress}%`
            }}
          />
        </div>
        <div className='info-col'>
          <h4>Goals Total:</h4>
          <h4>${goalsTotal.toFixed(2)}</h4>
        </div>
      </div>
    </div>
  );
};

export default Progress;
