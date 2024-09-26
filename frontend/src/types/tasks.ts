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
