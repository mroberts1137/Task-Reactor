import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllGoals } from '../../app/goalsReducer';
import AddItem from '../list/AddItem';
import List from '../list/List';
import '../list/List.css';

const GoalsBox = () => {
  const goals = useSelector(selectAllGoals);

  const [total, setTotal] = useState(0);

  const sumTotal = () => {
    return goals
      .map((goal) => parseFloat(goal.value))
      .reduce((acc, cur) => acc + cur, 0);
  };

  useEffect(() => {
    setTotal(sumTotal);
  }, [goals]);

  return (
    <div className='container'>
      <h3>
        Goals:$
        <span id='goals-total'>{total}</span>
      </h3>

      <div className='input-container'>
        <AddItem />
      </div>
      <div className='list-container'>
        <List items={goals} />
      </div>
    </div>
  );
};

export default GoalsBox;
