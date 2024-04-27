import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllTasks, removeTask } from '../../app/taskReducer';
import AddTask from '../list/AddTask';
import List from '../list/List';
import '../list/List.css';

const TaskBox = () => {
  const tasks = useSelector(selectAllTasks);

  const [total, setTotal] = useState(0);

  const sumTotal = (arr) => {
    return arr
      .map((item) => parseFloat(item.value))
      .reduce((acc, cur) => acc + cur, 0);
  };

  useEffect(() => {
    setTotal(sumTotal(tasks));
  }, [tasks]);

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
