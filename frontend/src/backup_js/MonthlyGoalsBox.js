import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllGoals,
  removeMonthlyGoalById,
  addMonthlyGoal
} from '../../app/monthlyGoalsSlice';
import { formatCurrency } from '../../utils/time_box_functions';

import AddItem from '../list/AddItem';
import List from '../list/List';

const MonthlyGoalsBox = ({ total }) => {
  const dispatch = useDispatch();
  const goals = useSelector(selectAllGoals);

  const displayKeys = {
    title: { name: 'Goal', type: 'String', show: true },
    value: { name: 'Value', type: 'Currency', show: true }
  };

  const handleDelete = (payload) => {
    dispatch(removeMonthlyGoalById(payload));
  };

  return (
    <div className='container'>
      <h3>
        Monthly Goals: <span id='goals-total'>{formatCurrency(total)}</span>
      </h3>

      <AddItem addAction={addMonthlyGoal} />
      <List
        items={goals}
        removeAction={handleDelete}
        displayKeys={displayKeys}
      />
    </div>
  );
};

export default MonthlyGoalsBox;
