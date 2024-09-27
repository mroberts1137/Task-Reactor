import { createContext } from 'react';
import { User, Task, Goal } from '../types/types';

export interface UserContextType {
  user: User | null;
  user_id: string | null;
}

export interface TaskContextType {
  tasks: Task[] | null;
  dailyTasks: Task[] | null;
}

export interface DateContextType {
  selectedDate: Date;
  todaysDate: Date;
}

export interface GoalsContextType {
  goals: Goal[];
}

export const UserContext = createContext<UserContextType | null>(null);
export const TaskContext = createContext<TaskContextType | null>(null);
export const GoalsContext = createContext<GoalsContextType | null>(null);
export const DateContext = createContext<DateContextType | null>(null);
