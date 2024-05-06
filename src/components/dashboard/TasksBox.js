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
        Completed Tasks: $<span id='goals-total'>{total}</span>
      </h3>

      <AddTask />

      <div className='list-container'>
        <List items={tasks} removeItem={removeTask} />
      </div>
    </div>
  );
};

export default TaskBox;
