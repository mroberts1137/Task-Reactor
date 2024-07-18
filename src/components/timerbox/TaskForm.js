import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { saveTask } from '../../app/savedTasksSlice';

const TaskForm = ({ selectedTask, setTaskSelect }) => {
  const { task, rate } = selectedTask;
  const dispatch = useDispatch();

  const handleSaveTask = () => {
    dispatch(saveTask({ task, rate }));
  };

  return (
    <div>
      <input
        type='text'
        value={task}
        onChange={(e) => setTaskSelect({ task: e.target.value, rate })}
        placeholder='Task'
      />
      <input
        type='number'
        value={rate}
        onChange={(e) => setTaskSelect({ task, rate: e.target.value })}
        placeholder='Rate'
      />
      <button onClick={handleSaveTask}>Save Task</button>
    </div>
  );
};
export default TaskForm;
