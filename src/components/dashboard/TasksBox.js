import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectAllTasks,
  selectTasksByDate,
  removeTask
} from '../../app/taskSlice';
import AddTask from '../list/AddTask';
import List from '../list/List';
import Calendar from './Calendar';
import TaskCalendar from './TaskCalendar';
// import WeeklyCalendar from './WeeklyCalendar';
import '../list/List.css';

const month = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
];

const TaskBox = ({ total }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const tasks = useSelector((state) => selectTasksByDate(state, selectedDate));

  return (
    <div className='container'>
      <h3>
        Completed Tasks: $<span id='goals-total'>{total.toFixed(2)}</span>
      </h3>
      <p>
        Selected Date: {month[selectedDate.getMonth()]}{' '}
        {selectedDate.getDate().toString()},{' '}
        {selectedDate.getFullYear().toString()}
      </p>
      <TaskCalendar />
      <AddTask />
      <List
        items={tasks}
        removeItem={removeTask}
        displayKeys={{
          startTime: 'Date',
          title: 'String',
          rate: 'Currency',
          duration: 'Duration',
          value: 'Currency'
        }}
      />
    </div>
  );
};

export default TaskBox;
