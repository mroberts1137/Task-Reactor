import React from 'react';
import { Task } from '../../types/types';
import {
  formatTime,
  formatCurrency,
  formatDuration
} from '../../utils/time_box_functions';

interface TaskTableProps {
  task: Task;
  clockRunning: boolean;
}

const TaskTable: React.FC<TaskTableProps> = ({ task, clockRunning }) => {
  const endTime =
    task.endTime || (task.startTime && clockRunning ? new Date() : null);

  return (
    <div className='outputBlock'>
      <table id='trackList'>
        <thead>
          <tr>
            <th>Start Time:</th>
            <th>End Time:</th>
            <th>Elapsed Time:</th>
            <th>Earnings:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatTime(task.startTime)}</td>
            <td style={{ color: endTime && clockRunning ? '#888' : '' }}>
              {formatTime(endTime)}
            </td>
            <td>{formatDuration(task.duration)}</td>
            <td>{formatCurrency(task.value)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
