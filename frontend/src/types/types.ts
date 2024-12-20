export interface User {
  user_id: string;
  username?: string;
  email?: string;
  admin?: boolean;
}

export interface Item {
  id: string;
}

export interface Task extends Item {
  id: string;
  title?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  hourlyRate?: number;
  taxRate?: number;
  grossIncome?: number;
  netIncome?: number;
}

export interface Goal extends Item {
  id: string;
  title: string;
  value: number;
}

export type SavedTask = {
  id: string;
  title: string;
  hourlyRate: number;
  taxRate: number;
};

export const isValidTask = (task: Task): boolean => {
  return (
    !!task.title.trim() &&
    task.hourlyRate >= 0 &&
    task.taxRate >= 0 &&
    task.taxRate <= 100
  );
};
