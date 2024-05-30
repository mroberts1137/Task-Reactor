import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './ProgressBox.css';
import { selectAllGoals } from '../../app/goalsReducer';

const Progress = ({ goalsTotal, totalEarnings }) => {
  const goals = useSelector(selectAllGoals);
  const [progress, setProgress] = useState(0);
  const [goalLines, setGoalLines] = useState([]);

  // get goal percentage lines
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
      <div
        className='flex-row'
        style={{
          width: '75%',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div className='flex-col info-col'>
          <h4>Total Earnings:</h4>
          <h4>${totalEarnings.toFixed(2)}</h4>
        </div>
        <div
          className='progress-bar'
          style={{
            width: '100%',
            height: '40px',
            position: 'relative',
            backgroundColor: 'lightgray'
          }}
        >
          {goalLines.map((goalLine, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${goalLine.offset}%`,
                width: `${goalLine.width}%`,
                height: '100%',
                backgroundColor: 'lightgray',
                borderRight: '3px solid black',
                borderLeft: '3px solid black'
              }}
            >
              <span
                style={{
                  textWeight: 'bold'
                }}
              >
                ${parseFloat(goalLine.value).toFixed(0)}
              </span>
            </div>
          ))}
          <div
            style={{
              position: 'absolute',
              left: 0,
              width: `${progress}%`,
              height: '100%',
              backgroundColor: 'rgba(0, 50, 255, 0.5)'
            }}
          />
        </div>
        <div className='flex-col info-col'>
          <h4>Goals Total:</h4>
          <h4>${goalsTotal.toFixed(2)}</h4>
        </div>
      </div>
    </div>
  );
};

export default Progress;
