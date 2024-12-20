import React from 'react';
import { Task } from '../../types/types';
import {
  formatTime,
  formatCurrency,
  formatDuration
} from '../../utils/time_box_functions';
import { Container } from '../../styles/components/Container';
import { Table } from '../../styles/components/Table';

interface TaskTableProps {
  task: Task;
  clockrunning: boolean;
}

const TaskTable: React.FC<TaskTableProps> = ({ task, clockrunning }) => {
  // eslint-disable-next-line
  const endTime =
    task.endTime || (task.startTime && clockrunning ? new Date() : null);

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <th>Start Time:</th>
            {/* <th>End Time:</th> */}
            <th>Elapsed Time:</th>
            <th>Gross Earnings:</th>
            <th>Net Earnings:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatTime(task.startTime)}</td>
            {/* <td style={{ color: endTime && clockrunning ? '#888' : '' }}>
              {formatTime(endTime)}
            </td> */}
            <td>{formatDuration(task.duration)}</td>
            <td>{formatCurrency(task.grossIncome)}</td>
            <td>{formatCurrency(task.netIncome)}</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default TaskTable;
