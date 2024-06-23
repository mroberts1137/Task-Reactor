import { useSelector } from 'react-redux';
import { selectAllGoals, removeGoal } from '../../app/goalsSlice';

import AddItem from '../list/AddItem';
import List from '../list/List';

const GoalsBox = ({ total }) => {
  const goals = useSelector(selectAllGoals);

  return (
    <div className='container'>
      <h3>
        Goals: $<span id='goals-total'>{total}</span>
      </h3>

      <AddItem />
      <List
        items={goals}
        removeItem={removeGoal}
        displayKeys={{ title: 'String', value: 'Currency' }}
      />
    </div>
  );
};

export default GoalsBox;
