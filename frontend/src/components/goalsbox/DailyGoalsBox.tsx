import { useContext } from 'react';

import AddItem from '../list/AddItem';
import List from '../list/List';

import { Goal } from '../../types/types';
import { DailyGoalsContext } from '../../contexts/context';
import { formatCurrency } from '../../utils/time_box_functions';
import { addDailyGoal, removeDailyGoalById } from '../../app/dailyGoalsThunks';

interface DisplayKey {
  name: string;
  show: boolean;
  type: 'Currency' | 'String' | 'Duration' | 'Date';
}

const GoalsBox: React.FC = () => {
  const { dailyGoals, dailyTotalGoals } = useContext(DailyGoalsContext);

  const displayKeys: Record<keyof Omit<Goal, 'id' | 'order'>, DisplayKey> = {
    title: { name: 'Goal', type: 'String', show: true },
    value: { name: 'Value', type: 'Currency', show: true }
  };

  return (
    <div className='container'>
      <h3>
        Daily Goals:{' '}
        <span id='goals-total'>{formatCurrency(dailyTotalGoals)}</span>
      </h3>

      <AddItem addAction={addDailyGoal} />
      <List
        items={dailyGoals}
        removeAction={removeDailyGoalById}
        displayKeys={displayKeys}
      />
    </div>
  );
};

export default GoalsBox;
