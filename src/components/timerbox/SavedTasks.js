import React from 'react';
import { useSelector } from 'react-redux';
import { selectSavedTasks } from '../../app/savedTasksSlice';

const SavedTasks = ({ onTaskSelect }) => {
  const savedTasks = useSelector(selectSavedTasks);

  return (
    <div>
      <h3>Saved Tasks:</h3>
      <select onChange={(e) => onTaskSelect(savedTasks[e.target.value])}>
        {savedTasks.map((task, index) => (
          <option key={index} value={index}>
            {task.task} - Rate: {task.rate}
          </option>
        ))}
      </select>
    </div>
  );
};
export default SavedTasks;
