import React, { ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { saveTask } from '../../app/savedTasksSlice';
import { Task } from '../../types/types';
import { AppDispatch } from '../../app/store';

interface TaskFormProps {
  selectedTask: Task;
  setTaskSelect: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ selectedTask, setTaskSelect }) => {
  const title = selectedTask?.title || '';
  const hourlyRate = selectedTask?.hourlyRate || 0;
  const taxRate = selectedTask?.taxRate || 0;

  const dispatch = useDispatch<AppDispatch>();

  // const handleTaskChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setTaskSelect({ ...selectedTask, [e.target.name]: e.target.value });
  // };

  const handleTaskChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Update task state with the new value from the input
    setTaskSelect({
      ...selectedTask,
      [name]:
        name === 'hourlyRate' || name === 'taxRate'
          ? parseFloat(value) || 0
          : value
    });
  };

  // Handle saving the task with default or sanitized values
  const handleSaveTask = () => {
    const sanitizedTask = title.trim() || 'Untitled Task';
    const sanitizedRate = hourlyRate || 0;
    const sanitizedTax = taxRate || 0;
    dispatch(
      saveTask({
        title: sanitizedTask,
        hourlyRate: sanitizedRate,
        taxRate: sanitizedTax
      })
    );
  };

  // Handle input change for task rate
  // const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const newRate = parseFloat(e.target.value) || 0; // Handle NaN with a default of 0
  //   setTaskSelect({ title, rate: newRate });
  // };

  return (
    <form>
      <label>
        Task:
        <input
          name='title'
          value={title}
          onChange={handleTaskChange}
          placeholder='Enter task title'
        />
      </label>
      <label>
        Hourly Rate:
        <input
          type='number'
          name='hourlyRate'
          value={hourlyRate}
          onChange={handleTaskChange}
          placeholder='Enter hourly rate'
        />
      </label>
      <label>
        Tax Rate:
        <input
          type='number'
          name='taxRate'
          value={taxRate}
          onChange={handleTaskChange}
          placeholder='Enter tax rate'
        />
      </label>
      <button onClick={handleSaveTask}>Save Task</button>
    </form>
  );
};

export default TaskForm;
