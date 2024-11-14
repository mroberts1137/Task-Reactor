import { useContext } from 'react';
import {
  DailyGoalsContext,
  EarningsContext,
  MonthlyGoalsContext
} from '../../contexts/context';
import ProgressDisplay from './ProgressDisplay';

const ProgressBox: React.FC = () => {
  const { dailyTotalEarnings, monthlyTotalEarnings } =
    useContext(EarningsContext);
  const { dailyGoals, dailyTotalGoals } = useContext(DailyGoalsContext);
  const { monthlyGoals, monthlyTotalGoals } = useContext(MonthlyGoalsContext);

  return (
    <div style={{ width: '100%' }}>
      <ProgressDisplay
        goals={dailyGoals}
        goalsTotal={dailyTotalGoals}
        earnings={dailyTotalEarnings}
      />
      <ProgressDisplay
        goals={monthlyGoals}
        goalsTotal={monthlyTotalGoals}
        earnings={monthlyTotalEarnings}
      />
    </div>
  );
};

export default ProgressBox;
