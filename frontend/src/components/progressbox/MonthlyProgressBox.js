import { useState, useEffect, useContext } from 'react';
import { formatCurrency } from '../../utils/time_box_functions';
import { EarningsContext, MonthlyGoalsContext } from '../../contexts/context';
import './ProgressBox.css';

const MonthlyProgress = () => {
  const { monthlyTotalEarnings } = useContext(EarningsContext);
  const { monthlyGoals, monthlyTotalGoals } = useContext(MonthlyGoalsContext);

  const [progress, setProgress] = useState(0);
  const [goalLines, setGoalLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const getGoalLines = (goals, maxProgress) => {
    let previousOffset = 0;
    const goalLinesValues = goals?.map((goal) => {
      const goalPercentage =
        maxProgress > 0 ? (goal.value / maxProgress) * 100 : 0;
      const offset = previousOffset;
      previousOffset += goalPercentage;

      return {
        offset,
        width: goalPercentage,
        value: goal.value
      };
    });

    return goalLinesValues;
  };

  useEffect(() => {
    const maxProgress = Math.max(monthlyTotalGoals, monthlyTotalEarnings);
    const calculatedProgress =
      monthlyTotalGoals > 0
        ? (monthlyTotalEarnings / monthlyTotalGoals) * 100
        : 0;
    setProgress(calculatedProgress);
    setGoalLines(getGoalLines(monthlyGoals, maxProgress));

    if (monthlyTotalEarnings > monthlyTotalGoals) setIsComplete(true);
    else setIsComplete(false);
  }, [progress, monthlyTotalEarnings, monthlyTotalGoals, monthlyGoals]);

  return (
    <div className='container'>
      {/* Progress Percentage */}
      <h3>{progress.toFixed(2)}%</h3>

      <div className='progress-container'>
        {/* Total Earnings */}
        <div className='info-col'>
          <h4>Total Monthly Earnings:</h4>
          <h4>{formatCurrency(monthlyTotalEarnings)}</h4>
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
          {goalLines?.map((goalLine, index) => (
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
          <h4>{formatCurrency(monthlyTotalGoals)}</h4>
        </div>
      </div>
    </div>
  );
};

export default MonthlyProgress;
