import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { saveTask } from '../../app/savedTasksSlice';

const TaskForm = ({ selectedTask }) => {
  const [task, setTask] = useState('');
  const [rate, setRate] = useState('');
  const dispatch = useDispatch();

  const handleSaveTask = () => {
    dispatch(saveTask({ task, rate }));
    setTask('');
    setRate('');
  };

  // If a selected task is provided, pre-fill the task and rate inputs
  useEffect(() => {
    if (selectedTask) {
      setTask(selectedTask.task);
      setRate(selectedTask.rate);
    }
  }, [selectedTask]);

  return (
    <div>
      <input
        type='text'
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder='Task'
      />
      <input
        type='number'
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        placeholder='Rate'
      />
      <button onClick={handleSaveTask}>Save Task</button>{' '}
    </div>
  );
};
export default TaskForm;

//
// OLD

/* <form>
<label htmlFor='taskName'>Task: </label>
<input
  type='text'
  onChange={(e) => setTaskName(e.target.value)}
  value={taskName}
  name='taskName'
/>
<label htmlFor='rate'>Rate: $</label>
<input
  type='text'
  onChange={(e) => setRate(e.target.value)}
  value={rate}
  name='rate'
/>
</form> */
