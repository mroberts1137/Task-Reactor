import React, { ChangeEvent, useEffect, useState } from 'react';
import { Task } from '../../types/types';
import { Input } from '../../styles/components/Table';
import { Form, Label } from '../../styles/components/AuthForms';
import { sanitizeNumber, sanitizeString } from '../../utils/sanitize-input';
import { validateForm } from '../../utils/validate-inputs';

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <span style={{ color: 'red', fontSize: '0.8em' }}>{message}</span>
);

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
  const [errors, setErrors] = useState<{
    title?: string;
    hourlyRate?: string;
    taxRate?: string;
  }>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    const { isValid, errors } = validateForm(selectedTask);
    setErrors(errors);
    setIsFormValid(isValid);
  }, [selectedTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSaveTask(selectedTask);
    }
  };

  const handleTaskChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue: string | number;

    switch (name) {
      case 'title':
        sanitizedValue = sanitizeString(value);
        break;
      case 'hourlyRate':
      case 'taxRate':
        sanitizedValue = sanitizeNumber(value);
        break;
      default:
        sanitizedValue = value;
    }

    const updatedTask = {
      ...selectedTask,
      [name]: sanitizedValue
    };

    setTaskSelect(updatedTask);
  };

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
            value={selectedTask.title || ''}
            onChange={handleTaskChange}
            placeholder='Enter task title'
            disabled={disabled}
            style={{ width: '16rem' }}
          />
          {errors.title && <ErrorMessage message={errors.title} />}
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
            value={selectedTask.hourlyRate || 0}
            onChange={handleTaskChange}
            placeholder='Enter hourly rate'
            disabled={disabled}
            style={{ width: '4rem' }}
          />
          {errors.hourlyRate && <ErrorMessage message={errors.hourlyRate} />}
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
            value={selectedTask.taxRate || 0}
            onChange={handleTaskChange}
            placeholder='Enter tax rate'
            disabled={disabled}
            style={{ width: '3rem' }}
          />
          {errors.taxRate && <ErrorMessage message={errors.taxRate} />}
        </div>
        <button type='submit' disabled={!isFormValid || disabled}>
          Save Task
        </button>
      </div>
    </Form>
  );
};

export default TaskForm;
