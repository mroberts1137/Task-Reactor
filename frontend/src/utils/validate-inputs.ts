import { isValidTask, Task } from '../types/types';

type Error = {
  title?: string;
  hourlyRate?: string;
  taxRate?: string;
};

export const validateForm = (
  task: Task
): {
  isValid: boolean;
  errors: Error;
} => {
  const newErrors: Error = {};
  const isValid = isValidTask(task);

  if (!task.title.trim()) {
    newErrors.title = 'Task title is required';
  }
  if (task.hourlyRate < 0) {
    newErrors.hourlyRate = 'Hourly rate cannot be negative';
  }
  if (task.taxRate < 0 || task.taxRate > 100) {
    newErrors.taxRate = 'Tax rate must be between 0 and 100';
  }

  return { isValid, errors: newErrors };
};
