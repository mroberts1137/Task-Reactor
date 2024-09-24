import { useSelector } from 'react-redux';
import {
  selectAllGoals,
  removeMonthlyGoalById,
  addMonthlyGoal
} from '../../app/monthlyGoalsSlice';

import AddItem from '../list/AddItem';
import List from '../list/List';

const MonthlyGoalsBox = ({ total }) => {
  const goals = useSelector(selectAllGoals);

  const displayKeys = {
    title: { name: 'Goal', type: 'String', show: true },
    value: { name: 'Value', type: 'Currency', show: true }
  };

  return (
    <div className='container'>
      <h3>
        Monthly Goals: $<span id='goals-total'>{total}</span>
      </h3>

      <AddItem addAction={addMonthlyGoal} />
      <List
        items={goals}
        removeAction={removeMonthlyGoalById}
        displayKeys={displayKeys}
      />
    </div>
  );
};

export default MonthlyGoalsBox;
