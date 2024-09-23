import { useSelector } from 'react-redux';
import { selectAllGoals, removeGoal, addGoal } from '../../app/dailyGoalsSlice';

import AddItem from '../list/AddItem';
import List from '../list/List';

const GoalsBox = ({ total }) => {
  const goals = useSelector(selectAllGoals);

  const displayKeys = {
    title: { name: 'Goal', type: 'String', show: true },
    value: { name: 'Value', type: 'Currency', show: true }
  };

  return (
    <div className='container'>
      <h3>
        Daily Goals: $<span id='goals-total'>{total}</span>
      </h3>

      <AddItem addAction={addGoal} />
      <List items={goals} removeAction={removeGoal} displayKeys={displayKeys} />
    </div>
  );
};

export default GoalsBox;
