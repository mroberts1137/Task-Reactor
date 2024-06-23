import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row, Button } from 'reactstrap';

import GoalsBox from '../goalsbox/GoalsBox.js';
import TasksBox from '../taskbox/TasksBox.js';
import TimerBox from '../timerbox/TimerBox.js';
import ProgressBox from '../progressbox/ProgressBox.js';
import CalendarBox from '../calendarbox/CalendarBox';
import SaveLoadButtons from '../SaveLoadButtons.js';
import SaveLoad from '../SaveLoad.js';
import DateDisplay from '../DateDisplay';
import TimeDisplay from '../TimeDisplay';

import { TaskContext, GoalsContext, DateContext } from '../../contexts/context';

import './Dashboard.css';

import { fetchTasks, selectAllTasks, reset } from '../../app/taskSlice.js';
import { selectAllGoals } from '../../app/goalsSlice.js';
import { sumTotal } from '../../utils/functions';

const Dashboard = () => {
  const dispatch = useDispatch();

  const goals = useSelector(selectAllGoals);
  const tasks = useSelector(selectAllTasks);

  const [goalsTotal, setGoalsTotal] = useState(0);
  const [tasksTotal, setTasksTotal] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const todaysDate = new Date();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    setGoalsTotal(sumTotal(goals));
  }, [goals]);

  useEffect(() => {
    setTasksTotal(sumTotal(tasks.taskArray));
  }, [tasks]);

  useEffect(() => {
    setTotalEarnings(tasksTotal + earnings);
  }, [tasksTotal, earnings]);

  const handleReset = () => {
    dispatch(reset());
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  return (
    <DateContext.Provider value={{ selectedDate, todaysDate }}>
      <TaskContext.Provider value={{ tasks }}>
        <GoalsContext.Provider value={{ goals }}>
          <div className='dashboard'>
            <div className='container'>
              <DateDisplay date={todaysDate} />
              <TimeDisplay date={todaysDate} />
              <button onClick={handleReset}>Reset State</button>
            </div>
            <Row className='row'>
              <TimerBox earningsChange={(val) => setEarnings(val)} />
              {/* <SaveLoadButtons />
          <SaveLoad /> */}
            </Row>
            <Row className='row'>
              <ProgressBox
                goalsTotal={goalsTotal}
                totalEarnings={totalEarnings}
              />
            </Row>
            <Row>
              <CalendarBox handleSelectDate={handleSelectDate} />
            </Row>
            <Row className='row'>
              <TasksBox />
            </Row>
            <Row>
              <GoalsBox total={goalsTotal} />
            </Row>
          </div>
        </GoalsContext.Provider>
      </TaskContext.Provider>
    </DateContext.Provider>
  );
};

export default Dashboard;
