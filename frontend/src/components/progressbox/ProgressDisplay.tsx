import { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/time_box_functions';
import {
  Container,
  GoalLine,
  InfoCol,
  Progress,
  ProgressBar,
  ProgressContainer
} from '../../styles/components/ProgressBox';
import { Goal } from '../../types/types';

interface ProgressDisplayProps {
  goals: Goal[];
  goalsTotal: number;
  earnings: number;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  goals,
  goalsTotal,
  earnings
}) => {
  const [progress, setProgress] = useState(0);
  const [goalLines, setGoalLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const getGoalLines = (goals: Goal[], maxProgress: number) => {
    let previousOffset = 0;
    return goals?.map((goal) => {
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
  };

  useEffect(() => {
    const maxProgress = Math.max(goalsTotal, earnings);
    const calculatedProgress =
      goalsTotal > 0 ? (earnings / goalsTotal) * 100 : 0;
    setProgress(calculatedProgress);
    setGoalLines(getGoalLines(goals, maxProgress));

    setIsComplete(earnings > goalsTotal);
  }, [earnings, goalsTotal, goals]);

  return (
    <Container>
      {/* Progress Percentage */}
      <h3>{progress.toFixed(2)}%</h3>

      <ProgressContainer>
        {/* Total Earnings */}
        <InfoCol>
          <h4>Total Earnings:</h4>
          <h4>{formatCurrency(earnings)}</h4>
        </InfoCol>

        {/* Progress Bar Container */}
        <ProgressBar>
          <Progress isComplete={isComplete} progress={progress} />

          {/* Goal Division Lines */}
          {goalLines?.map((goalLine, index) => (
            <GoalLine
              key={index}
              offset={goalLine.offset}
              width={goalLine.width}
              isExceeded={progress >= goalLine.offset + goalLine.width}
              isComplete={isComplete}
            >
              <span>${goalLine.value.toFixed(0)}</span>
            </GoalLine>
          ))}
        </ProgressBar>

        {/* Goals Total */}
        <InfoCol>
          <h4>Goals Total:</h4>
          <h4>{formatCurrency(goalsTotal)}</h4>
        </InfoCol>
      </ProgressContainer>
    </Container>
  );
};

export default ProgressDisplay;
