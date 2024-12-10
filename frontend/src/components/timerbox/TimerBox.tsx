import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  EarningsContext,
  UserContext,
  UserContextType
} from '../../contexts/context';

import TaskTable from './TaskTable';
import TaskForm from './TaskForm';
import SavedTasks from './SavedTasks';
import useInterval from '../../hooks/useInterval';
import { SavedTask, Task } from '../../types/types';
import { AppDispatch } from '../../app/store';
import { resetTask, updateTask } from '../../utils/time_box_functions';
import { addTask } from '../../app/tasksThunks';
import { StartButton } from '../../styles/components/Button';
import { Container, FlexRow } from '../../styles/components/Container';
import { H3 } from '../../styles/components/Text';
import {
  editTask,
  saveTask,
  selectSavedTasks
} from '../../app/savedTasksSlice';

const TimerBox: React.FC = () => {
  const [clockRunning, setClockRunning] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task>(resetTask());
  const { user_id }: UserContextType = useContext(UserContext);
  const { earningsChange } = useContext(EarningsContext);

  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const savedTasks = useSelector(selectSavedTasks);

  const dispatch = useDispatch<AppDispatch>();

  useInterval(
    () => setSelectedTask(updateTask(selectedTask)),
    clockRunning ? 1000 : null
  );

  useEffect(() => {
    earningsChange(selectedTask?.netIncome || 0);
  }, [selectedTask?.netIncome, earningsChange]);

  const toggleClock = () => {
    if (clockRunning) {
      const endTime = new Date();
      const updatedTask = {
        ...updateTask(selectedTask),
        endTime
      };

      reset();

      if (user_id) {
        dispatch(addTask({ user_id, item: updatedTask }));
      } else {
        console.log('No user logged in');
      }
    } else {
      setSelectedTask({ ...selectedTask, startTime: new Date() });
    }
    setClockRunning(!clockRunning);
  };

  const handleSaveTask = (task: Task) => {
    const sanitizedTask = {
      title: task.title.trim() || 'Untitled Task',
      hourlyRate: task.hourlyRate || 0,
      taxRate: task.taxRate || 0
    };

    const existingTask = savedTasks.find(
      (t) => t.title === sanitizedTask.title
    );
    if (existingTask) {
      setConflictMessage('Task already exists.');
      setTimeout(() => setConflictMessage(null), 3000);
      return false; // Return false to indicate save failed
    } else {
      dispatch(saveTask(sanitizedTask));
      return true; // Return true to indicate save succeeded
    }
  };

  const handleEditTask = (updatedTask: SavedTask) => {
    const existingTask = savedTasks.find(
      (t) => t.title === updatedTask.title && t.id !== updatedTask.id
    );
    if (existingTask) {
      setConflictMessage('A task with this name already exists.');
      setTimeout(() => setConflictMessage(null), 3000);
      return false;
    } else {
      dispatch(editTask(updatedTask));
      return true;
    }
  };

  const reset = () => {
    setSelectedTask(resetTask());
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

      <div>
        {conflictMessage && <div>{conflictMessage}</div>}
        <TaskForm
          selectedTask={selectedTask}
          setTaskSelect={setSelectedTask}
          onSaveTask={handleSaveTask}
          disabled={clockRunning}
        />
        <SavedTasks
          onTaskSelect={setSelectedTask}
          onEditTask={handleEditTask}
          disabled={clockRunning}
        />
      </div>

      <FlexRow>
        {/** Start Button */}
        <StartButton
          disabled={!clockRunning && !selectedTask.title}
          clockRunning={clockRunning}
          onClick={toggleClock}
        >
          {clockRunning ? 'Stop' : 'Start'}
        </StartButton>
      </FlexRow>

      <TaskTable task={selectedTask} clockRunning={clockRunning} />
    </Container>
  );
};

export default TimerBox;
