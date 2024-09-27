export interface Task {
  id?: string;
  title?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  rate?: number;
  value?: number;
  [key: string]: any;
}

export interface User {
  user_id: string;
  username?: string;
  email?: string;
}

export interface Goal {
  id?: string;
  title: string;
  value: string;
}
