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
  hourly_rate?: number;
  tax_rate?: number;
  grossIncome?: number;
  netIncome?: number;
  [key: string]: any;
}

export interface Goal extends Item {
  id: string;
  title: string;
  value: number;
}
