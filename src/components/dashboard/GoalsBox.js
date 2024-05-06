import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllGoals, removeGoal } from '../../app/goalsReducer';

import AddItem from '../list/AddItem';
import List from '../list/List';
import '../list/List.css';

const GoalsBox = ({ total }) => {
  const goals = useSelector(selectAllGoals);

  return (
    <div className='container'>
      <h3>
        Goals: $<span id='goals-total'>{total}</span>
      </h3>

      <div className='input-container'>
        <AddItem />
      </div>
      <div className='list-container'>
        <List items={goals} removeItem={removeGoal} />
      </div>
    </div>
  );
};

export default GoalsBox;
