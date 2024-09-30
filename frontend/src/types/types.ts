export interface User {
  user_id: string;
  username?: string;
  email?: string;
}

export interface Item {
  _id?: string;
}

export interface Task extends Item {
  _id?: string;
  title?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  rate?: number;
  value?: number;
  [key: string]: any;
}

export interface Goal extends Item {
  _id?: string;
  title: string;
  value: string;
}
