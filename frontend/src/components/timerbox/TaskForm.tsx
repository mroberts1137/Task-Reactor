import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveTask, selectSavedTasks } from '../../app/savedTasksSlice';
import { SavedTask, Task } from '../../types/types';
import { AppDispatch } from '../../app/store';
import { Input } from '../../styles/components/Table';
import { Form, Label } from '../../styles/components/AuthForms';

interface TaskFormProps {
  selectedTask: Task;
  setTaskSelect: (task: Task) => void;
  onSaveTask: (task: Task) => boolean;
  disabled: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  selectedTask,
  setTaskSelect,
  onSaveTask,
  disabled
}) => {
  const title = selectedTask?.title || '';
  const hourlyRate = selectedTask?.hourlyRate || 0;
  const taxRate = selectedTask?.taxRate || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    onSaveTask(selectedTask);
  };

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
  // const handleSaveTask = () => {
  //   const sanitizedTask = title.trim() || 'Untitled Task';
  //   const sanitizedRate = hourlyRate || 0;
  //   const sanitizedTax = taxRate || 0;
  //   const task = {
  //     title: sanitizedTask,
  //     hourlyRate: sanitizedRate,
  //     taxRate: sanitizedTax
  //   };
  //   const existingTask = savedTasks.find((t) => t.title === task.title);
  //   if (existingTask) {
  //     setConflictMessage('Task already exists.');
  //     setTimeout(() => setConflictMessage(null), 3000); // Clear message after 3 seconds
  //   } else {
  //     dispatch(saveTask(task));
  //   }
  // };

  return (
    <Form onSubmit={handleSubmit}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginInline: '1rem'
          }}
        >
          <Label>Task:</Label>
          <Input
            name='title'
            value={title}
            onChange={handleTaskChange}
            placeholder='Enter task title'
            disabled={disabled}
            style={{ width: '16rem' }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginInline: '1rem'
          }}
        >
          <Label>Hourly Rate: $</Label>
          <Input
            type='number'
            name='hourlyRate'
            value={hourlyRate}
            onChange={handleTaskChange}
            placeholder='Enter hourly rate'
            disabled={disabled}
            style={{ width: '4rem' }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginInline: '1rem'
          }}
        >
          <Label>Tax Rate: %</Label>
          <Input
            type='number'
            name='taxRate'
            value={taxRate}
            onChange={handleTaskChange}
            placeholder='Enter tax rate'
            disabled={disabled}
            style={{ width: '3rem' }}
          />
        </div>
        <button type='submit'>Save Task</button>
      </div>
    </Form>
  );
};

export default TaskForm;
