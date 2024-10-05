import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './ProgressBox.css';
import { selectAllGoals } from '../../app/monthlyGoalsSlice';
import { formatCurrency } from '../../utils/time_box_functions';
import { getGoalLines } from '../../utils/functions';

const MonthlyProgress = ({ totalEarnings, goalsTotal }) => {
  const goals = useSelector(selectAllGoals);
  const [progress, setProgress] = useState(0);
  const [goalLines, setGoalLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const maxProgress = Math.max(goalsTotal, totalEarnings);
    const calculatedProgress = (totalEarnings / goalsTotal) * 100;
    setProgress(calculatedProgress);
    setGoalLines(getGoalLines(goals, maxProgress));

    if (totalEarnings > goalsTotal) setIsComplete(true);
    else setIsComplete(false);
  }, [totalEarnings, goalsTotal, goals]);

  return (
    <div className='container'>
      {/* Progress Percentage */}
      <h3>{progress.toFixed(2)}%</h3>

      <div className='progress-container'>
        {/* Total Earnings */}
        <div className='info-col'>
          <h4>Total Monthly Earnings:</h4>
          <h4>{formatCurrency(totalEarnings)}</h4>
        </div>

        {/* Progress Bar Container */}
        <div className='progress-bar'>
          {/* Progress Bar */}
          <div
            className={`progress ${isComplete ? 'green' : ''}`}
            style={{
              width: `${Math.min(progress, 100)}%`
            }}
          />

          {/* Goal Division Lines */}
          {goalLines.map((goalLine, index) => (
            <div
              key={index}
              className={`goal-line ${
                progress >= goalLine.offset + goalLine.width ? 'exceeded' : ''
              } ${isComplete ? 'green' : ''}
              `}
              style={{
                left: `${goalLine.offset}%`,
                width: `${goalLine.width}%`
              }}
            >
              <span>${goalLine.value.toFixed(0)}</span>
            </div>
          ))}
        </div>

        {/* Goals Total */}
        <div className='info-col'>
          <h4>Monthly Goals Total:</h4>
          <h4>{formatCurrency(goalsTotal)}</h4>
        </div>
      </div>
    </div>
  );
};

export default MonthlyProgress;
