import { Task } from '../types/types';

export const calculateEarnings = (
  elapsedTime: number,
  hourlyRate: number,
  taxRate: number
): { grossIncome: number; netIncome: number } => {
  const hours = elapsedTime / (1000 * 60 * 60);
  const grossIncome = Math.floor(hours * hourlyRate * 100) / 100;
  const taxDeduction = (grossIncome * taxRate) / 100;
  const netIncome = grossIncome - taxDeduction;
  return { grossIncome, netIncome };
};

export const calculateElapsedTime = (
  startTime?: Date,
  endTime?: Date
): number => {
  if (!startTime || !endTime) return 0;
  return endTime.getTime() - startTime.getTime();
};

export const formatTime = (time?: Date): string => {
  if (!time) return '-';
  return `${time.getHours()}:${time
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
};

export const formatHourMin = (time?: Date): string => {
  if (!time) return '-';
  return `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
};

export const formatDuration = (duration?: number): string => {
  if (!duration) return '-';
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const seconds = Math.floor((duration / 1000) % 60);
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

export const formatCurrency = (value: number): string => {
  if (!value) return '$0.00';
  // if (isNaN(value)) value = parseFloat(value);
  return `$${value.toFixed(2)}`;
};

export const resetTask = (): Task => ({
  id: undefined,
  title: '',
  startTime: undefined,
  endTime: undefined,
  duration: 0,
  hourlyRate: 0,
  taxRate: 0,
  grossIncome: 0,
  netIncome: 0
});

export const updateTask = (task: Task): Task => {
  if (task?.startTime) {
    const endTime = task?.endTime ?? new Date();
    const duration = calculateElapsedTime(task.startTime, endTime);
    const { grossIncome, netIncome } = calculateEarnings(
      duration,
      task.hourlyRate,
      task.taxRate
    );
    return { ...task, duration, grossIncome, netIncome } as Task;
  }
  return task;
};
