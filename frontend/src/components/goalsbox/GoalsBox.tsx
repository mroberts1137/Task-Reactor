import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllGoals,
  removeDailyGoalById,
  addDailyGoal
} from '../../app/dailyGoalsSlice';

import AddItem from '../list/AddItem';
import List from '../list/List';

import { Goal } from '../../types/types';
import { AppDispatch } from '../../app/store';
import { UserIdItemIdPayload } from '../../types/payloads';
import { useContext } from 'react';
import { UserContext } from '../../contexts/context';

interface GoalsBoxProps {
  total: number;
}

interface DisplayKey {
  name: string;
  type: 'String' | 'Currency';
  show: boolean;
}

const GoalsBox: React.FC<GoalsBoxProps> = ({ total }) => {
  const dispatch = useDispatch<AppDispatch>();
  const goals = useSelector(selectAllGoals) as Goal[];
  const { user_id } = useContext(UserContext);

  const handleDelete = (payload) => {
    dispatch(removeDailyGoalById(payload));
  };

  const displayKeys: Record<keyof Omit<Goal, '_id'>, DisplayKey> = {
    title: { name: 'Goal', type: 'String', show: true },
    value: { name: 'Value', type: 'Currency', show: true }
  };

  return (
    <div className='container'>
      <h3>
        Daily Goals: $<span id='goals-total'>{total.toFixed(2)}</span>
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
