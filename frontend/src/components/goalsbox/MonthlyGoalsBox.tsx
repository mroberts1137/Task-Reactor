import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllGoals,
  removeMonthlyGoalById,
  addMonthlyGoal
} from '../../app/monthlyGoalsSlice';

import AddItem from '../list/AddItem';
import List from '../list/List';

import { Goal } from '../../types/types';
import { AppDispatch } from '../../app/store';
import { UserContext } from '../../contexts/context';
import { useContext } from 'react';
import { UserIdItemIdPayload } from '../../types/payloads';

interface GoalsBoxProps {
  total: number;
}

interface DisplayKey {
  name: string;
  type: 'String' | 'Currency';
  show: boolean;
}

const MonthlyGoalsBox: React.FC<GoalsBoxProps> = ({ total }) => {
  const dispatch = useDispatch<AppDispatch>();
  const goals = useSelector(selectAllGoals) as Goal[];
  const { user_id } = useContext(UserContext);

  const displayKeys: Record<keyof Omit<Goal, '_id'>, DisplayKey> = {
    title: { name: 'Goal', type: 'String', show: true },
    value: { name: 'Value', type: 'Currency', show: true }
  };

  const handleDelete = (payload) => {
    dispatch(removeMonthlyGoalById(payload));
  };

  return (
    <div className='container'>
      <h3>
        Monthly Goals: $<span id='goals-total'>{total}</span>
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
