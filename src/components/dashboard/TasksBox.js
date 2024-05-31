import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllTasks, removeTask } from '../../app/taskReducer';
import AddTask from '../list/AddTask';
import List from '../list/List';
import '../list/List.css';

const TaskBox = ({ total }) => {
  const tasks = useSelector(selectAllTasks);

  return (
    <div className='container'>
      <h3>
        Completed Tasks: $<span id='goals-total'>{total.toFixed(2)}</span>
      </h3>

      <AddTask />
      <List
        items={tasks}
        removeItem={removeTask}
        displayKeys={{
          title: 'String',
          rate: 'Currency',
          duration: 'DateTime',
          value: 'Currency'
        }}
      />
    </div>
  );
};

export default TaskBox;
