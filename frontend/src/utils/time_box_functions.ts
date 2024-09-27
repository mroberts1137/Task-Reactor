import { Task } from '../types/types';

export const calculateEarnings = (
  elapsedTime: number,
  rate: number
): number => {
  return Math.floor(((elapsedTime / (1000 * 60 * 60)) * rate * 100) / 100);
};

export const calculateElapsedTime = (startTime?: Date): number => {
  if (!startTime) return 0;
  const currentTime = new Date();
  return currentTime.getTime() - startTime.getTime();
};

export const formatTime = (time?: Date): string => {
  if (!time) return '-';
  return `${time.getHours()}:${time
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
};

export const formatDuration = (duration?: number): string => {
  if (!duration) return '-';
  return `${Math.floor(duration / (1000 * 60 * 60))}:${(
    Math.floor(duration / (1000 * 60)) % 60
  )
    .toString()
    .padStart(2, '0')}:${(Math.floor(duration / 1000) % 60)
    .toString()
    .padStart(2, '0')}`;
};

export const formatCurrency = (value?: number): string => {
  return `$${value?.toFixed(2)}`;
};

export const resetTask = (): Task => ({
  title: '',
  startTime: undefined,
  endTime: undefined,
  duration: undefined,
  rate: 0,
  value: 0
});

export const updateTask = (task: Task) => {
  if (task?.startTime) {
    const duration = calculateElapsedTime(task.startTime);
    const value = calculateEarnings(duration, task.rate);
    return { ...task, duration, value } as Task;
  }
  return task;
};
