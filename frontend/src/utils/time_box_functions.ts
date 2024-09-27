import { Task } from '../types/types';

export const calculateEarnings = (
  elapsedTime: number,
  rate: number
): number => {
  return Math.floor(((elapsedTime / (1000 * 60 * 60)) * rate * 100) / 100);
};

export const formatTime = (time: number): string => {
  const hours = Math.floor(time / (1000 * 60 * 60));
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const seconds = Math.floor((time / 1000) % 60);

  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

export const resetTask = (): Task => ({
  title: '',
  startTime: undefined,
  endTime: undefined,
  duration: undefined,
  rate: 0,
  value: 0
});

export const createNewTask = (
  task: Task,
  elapsedTime: number,
  earnings: number
): Task => ({
  title: task.title || 'N/A',
  startTime: task.startTime || new Date(),
  endTime: new Date(),
  duration: parseFloat(elapsedTime.toString()) || 0,
  value: parseFloat(earnings.toString()) || 0,
  rate: parseFloat(task.rate.toString()) || 0
});
