import React from 'react';
import { useSelector } from 'react-redux';
import { selectSavedTasks } from '../../app/savedTasksSlice';
import { Task } from '../../types/types';
import { Container } from '../../styles/components/Container';
import { H3 } from '../../styles/components/Text';

const SavedTasks = ({ onTaskSelect, disabled }) => {
  const savedTasks: Task[] = useSelector(selectSavedTasks);

  return (
    <Container>
      <H3>Saved Tasks:</H3>
      {!disabled ? (
        <select onChange={(e) => onTaskSelect(savedTasks[e.target.value])}>
          {savedTasks?.map((task, index) => (
            <option key={index} value={index}>
              {task.task} - Rate: {task.rate}
            </option>
          ))}
        </select>
      ) : (
        <></>
      )}
    </Container>
  );
};
export default SavedTasks;
