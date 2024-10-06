import React, { ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { saveTask } from '../../app/savedTasksSlice';
import { Task } from '../../types/types';
import { AppDispatch } from '../../app/store';

interface TaskFormProps {
  selectedTask: Task;
  setTaskSelect: (task: Task) => void;
  disabled: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  selectedTask,
  setTaskSelect,
  disabled
}) => {
  const title = selectedTask?.title || '';
  const hourlyRate = selectedTask?.hourlyRate || 0;
  const taxRate = selectedTask?.taxRate || 0;

  const dispatch = useDispatch<AppDispatch>();

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

  return (
    <form>
      <label>
        Task:
        <input
          name='title'
          value={title}
          onChange={handleTaskChange}
          placeholder='Enter task title'
          disabled={disabled}
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
          disabled={disabled}
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
          disabled={disabled}
        />
      </label>
      <button onClick={handleSaveTask}>Save Task</button>
    </form>
  );
};

export default TaskForm;
