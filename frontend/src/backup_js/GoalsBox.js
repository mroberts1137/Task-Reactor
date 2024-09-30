import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllGoals,
  removeDailyGoalById,
  addDailyGoal
} from '../../app/dailyGoalsSlice';
import { formatCurrency } from '../../utils/time_box_functions';

import AddItem from '../list/AddItem';
import List from '../list/List';

const GoalsBox = ({ total }) => {
  const dispatch = useDispatch();
  const goals = useSelector(selectAllGoals);

  const handleDelete = (payload) => {
    dispatch(removeDailyGoalById(payload));
  };

  const displayKeys = {
    title: { name: 'Goal', type: 'String', show: true },
    value: { name: 'Value', type: 'Currency', show: true }
  };

  return (
    <div className='container'>
      <h3>
        Daily Goals: <span id='goals-total'>{formatCurrency(total)}</span>
      </h3>

      <AddItem addAction={addDailyGoal} />
      <List
        items={goals}
        removeAction={handleDelete}
        displayKeys={displayKeys}
      />
    </div>
  );
};

export default GoalsBox;
