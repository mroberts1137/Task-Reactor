import { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import {
  EarningsContext,
  UserContext,
  UserContextType
} from '../../contexts/context';

import TaskTable from './TaskTable';
import TaskForm from './TaskForm';
import SavedTasks from './SavedTasks';
import useInterval from '../../hooks/useInterval';
import { Task } from '../../types/types';
import { AppDispatch } from '../../app/store';
import { resetTask, updateTask } from '../../utils/time_box_functions';
import { addTask } from '../../app/tasksThunks';
import { StartButton } from '../../styles/components/Button';
import { Container, FlexRow } from '../../styles/components/Container';
import { H3 } from '../../styles/components/Text';

const TimerBox: React.FC = () => {
  const [clockRunning, setClockRunning] = useState<boolean>(false);
  const [task, setTask] = useState<Task>(resetTask());
  const { user_id }: UserContextType = useContext(UserContext);
  const { earningsChange } = useContext(EarningsContext);

  const dispatch = useDispatch<AppDispatch>();

  useInterval(() => setTask(updateTask(task)), clockRunning ? 1000 : null);

  useEffect(() => {
    earningsChange(task?.netIncome || 0);
  }, [task?.netIncome, earningsChange]);

  const handleTaskSelect = (selectedTask: Task) => {
    setTask((prevTask) => ({ ...prevTask, ...selectedTask }));
  };

  const toggleClock = () => {
    if (clockRunning) {
      const endTime = new Date();
      const updatedTask = {
        ...updateTask(task),
        endTime
      };

      reset();

      if (user_id) {
        dispatch(addTask({ user_id, item: updatedTask }));
      } else {
        console.log('No user logged in');
      }
    } else {
      setTask({ ...task, startTime: new Date() });
    }
    setClockRunning(!clockRunning);
  };

  const reset = () => {
    setTask(resetTask());
  };

  return (
    <Container>
      <H3>
        Current Task:{' '}
        {clockRunning ? (
          <p style={{ color: 'green', marginLeft: '20px' }}>Running...</p>
        ) : (
          <></>
        )}
      </H3>

      <TaskForm
        selectedTask={task}
        setTaskSelect={handleTaskSelect}
        disabled={clockRunning}
      />
      <SavedTasks onTaskSelect={handleTaskSelect} disabled={clockRunning} />

      <FlexRow>
        {/** Start Button */}
        <StartButton
          disabled={!clockRunning && !task.title}
          clockRunning={clockRunning}
          onClick={toggleClock}
        >
          {clockRunning ? 'Stop' : 'Start'}
        </StartButton>
      </FlexRow>

      <TaskTable task={task} clockRunning={clockRunning} />
    </Container>
  );
};

export default TimerBox;
