import { useState, useEffect } from 'react';
import './ProgressBox.css';

const ProgressBar = ({ earnings, goals, totalGoals }) => {
  const [progress, setProgress] = useState(0);
  const [goalLines, setGoalLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const getGoalLines = (goals, maxProgress) => {
    let previousOffset = 0;
    const goalLinesValues = goals?.map((goal) => {
      const goalValue = parseFloat(goal.value);
      const goalPercentage = (goalValue / maxProgress) * 100;
      const offset = previousOffset;
      previousOffset += goalPercentage;

      return {
        offset,
        width: goalPercentage,
        value: goalValue
      };
    });

    return goalLinesValues;
  };

  useEffect(() => {
    const maxProgress = Math.max(totalGoals, earnings);
    setProgress((earnings / totalGoals) * 100);
    setGoalLines(getGoalLines(goals, maxProgress));
  }, [earnings, totalGoals, goals]);

  return (
    <div className='container'>
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
    </div>
  );
};

export default ProgressBar;
