import { useContext } from 'react';

import AddItem from '../list/AddItem';
import List from '../list/List';

import { Goal } from '../../types/types';
import { MonthlyGoalsContext } from '../../contexts/context';
import { formatCurrency } from '../../utils/time_box_functions';
import {
  addMonthlyGoal,
  removeMonthlyGoalById
} from '../../app/monthlyGoalsThunks';

interface DisplayKey {
  name: string;
  show: boolean;
  type: 'Currency' | 'String' | 'Duration' | 'Date';
}

const MonthlyGoalsBox: React.FC = () => {
  const { monthlyGoals, monthlyTotalGoals } = useContext(MonthlyGoalsContext);

  const displayKeys: Record<keyof Omit<Goal, 'id' | 'order'>, DisplayKey> = {
    title: { name: 'Goal', type: 'String', show: true },
    value: { name: 'Value', type: 'Currency', show: true }
  };

  return (
    <div className='container'>
      <h3>
        Monthly Goals:{' '}
        <span id='goals-total'>{formatCurrency(monthlyTotalGoals)}</span>
      </h3>

      <AddItem addAction={addMonthlyGoal} />
      <List
        items={monthlyGoals}
        removeAction={removeMonthlyGoalById}
        displayKeys={displayKeys}
      />
    </div>
  );
};

export default MonthlyGoalsBox;
