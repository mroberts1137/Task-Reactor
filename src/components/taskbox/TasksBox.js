import { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import {
  selectAllTasks,
  selectTasksByDate,
  removeTask
} from '../../app/taskSlice';
import DateDisplay from '../DateDisplay';
import AddTask from '../list/AddTask';
import List from '../list/List';
import { DateContext } from '../../contexts/context';

const TaskBox = ({ total }) => {
  const { selectedDate } = useContext(DateContext);
  const tasks = useSelector((state) => selectTasksByDate(state, selectedDate));

  return (
    <div className='container'>
      <h3>
        Completed Tasks: $<span id='goals-total'>{total.toFixed(2)}</span>
      </h3>
      <p>
        Selected Date: <DateDisplay date={selectedDate} />
      </p>
      <AddTask />
      <List
        items={tasks}
        removeItem={removeTask}
        displayKeys={{
          title: 'String',
          startTime: 'Date',
          endTime: 'Date',
          duration: 'Duration',
          rate: 'Currency',
          value: 'Currency'
        }}
      />
    </div>
  );
};

export default TaskBox;
