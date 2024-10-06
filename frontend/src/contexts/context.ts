import { createContext } from 'react';
import { User, Task, Goal } from '../types/types';

export interface UserContextType {
  user: User | null;
  user_id: string | null;
}

export interface TaskContextType {
  tasks: Task[] | null;
  dailyTasks: Task[] | null;
  monthlyTasks: Task[] | null;
}

export interface EarningsContextType {
  dailyTasksEarnings: number;
  dailyTotalEarnings: number;
  monthlyTotalEarnings: number;
  earningsChange: (val: number) => void;
}

export interface DateContextType {
  todaysDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export interface DailyGoalsContextType {
  dailyGoals: Goal[];
  dailyTotalGoals: number;
}

export interface MonthlyGoalsContextType {
  monthlyGoals: Goal[];
  monthlyTotalGoals: number;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);
export const EarningsContext = createContext<EarningsContextType | undefined>(
  undefined
);
export const DailyGoalsContext = createContext<
  DailyGoalsContextType | undefined
>(undefined);
export const MonthlyGoalsContext = createContext<
  MonthlyGoalsContextType | undefined
>(undefined);
export const DateContext = createContext<DateContextType | undefined>(
  undefined
);
