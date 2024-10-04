import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row, Button } from 'reactstrap';

import GoalsBox from '../goalsbox/GoalsBox';
import MonthlyGoalsBox from '../goalsbox/MonthlyGoalsBox';
import TasksBox from '../taskbox/TasksBox';
import TimerBox from '../timerbox/TimerBox';
import ProgressBox from '../progressbox/ProgressBox';
import MonthlyProgressBox from '../progressbox/MonthlyProgressBox';
import CalendarBox from '../calendarbox/CalendarBox';
import SaveLoadButtons from '../SaveLoadButtons';
import SaveLoad from '../SaveLoad';
import DateDisplay from '../DateDisplay';
import TimeDisplay from '../TimeDisplay';

import {
  UserContext,
  TaskContext,
  GoalsContext,
  DateContext
} from '../../contexts/context';

import './Dashboard.css';

import { selectUserId, selectUser } from '../../app/userSlice';
import {
  fetchTasks,
  selectAllTasks,
  selectTasksByDate,
  selectAllTasksByMonth,
  reset
} from '../../app/tasksSlice';
import { selectAllGoals } from '../../app/dailyGoalsSlice';
import { selectAllGoals as selectAllMonthlyGoals } from '../../app/monthlyGoalsSlice';
import { sumTotal } from '../../utils/functions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const loggedin_userId = useSelector(selectUserId);
  const loggedin_user = useSelector(selectUser);

  const [user, setUser] = useState(null);
  const [user_id, setUserId] = useState(null);
  const [goalsTotal, setGoalsTotal] = useState(0);
  const [monthlyGoalsTotal, setMonthlyGoalsTotal] = useState(0);
  const [tasksTotal, setTasksTotal] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const todaysDate = new Date();

  const dailyGoals = useSelector(selectAllGoals);
  const monthlyGoals = useSelector(selectAllMonthlyGoals);
  const tasks = useSelector(selectAllTasks);
  const dailyTasks = useSelector((state) =>
    selectTasksByDate(state, selectedDate)
  );
  const monthlyTasks = useSelector((state) =>
    selectAllTasksByMonth(state, selectedDate)
  );

  useEffect(() => {
    if (loggedin_userId && loggedin_user) {
      setUser(loggedin_user);
      setUserId(loggedin_userId);
      dispatch(fetchTasks({ user_id: loggedin_userId }));
    }
  }, [dispatch, loggedin_userId, loggedin_user]);

  useEffect(() => {
    setGoalsTotal(sumTotal(dailyGoals.map((item) => parseFloat(item.value))));
  }, [dailyGoals]);

  useEffect(() => {
    setMonthlyGoalsTotal(
      sumTotal(monthlyGoals.map((item) => parseFloat(item.value)))
    );
  }, [monthlyGoals]);

  useEffect(() => {
    setTasksTotal(
      sumTotal(dailyTasks.map((item) => parseFloat(item.netIncome)))
    );
  }, [dailyTasks]);

  useEffect(() => {
    setTotalEarnings(tasksTotal + earnings);
  }, [tasksTotal, earnings]);

  const handleReset = () => {
    dispatch(reset());
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const earningsChange = useCallback((val) => {
    setEarnings(val);
  }, []);

  const monthlyTotalEarnings = sumTotal(
    monthlyTasks.map((item) => parseFloat(item.value))
  );

  const handleLoadTasks = () => {
    if (user_id) {
      dispatch(fetchTasks({ user_id }));
      console.log(`Tasks: ${JSON.stringify(tasks)}`);
    }
  };

  return (
    <UserContext.Provider value={{ user, user_id }}>
      <DateContext.Provider value={{ selectedDate, todaysDate }}>
        <TaskContext.Provider value={{ tasks, dailyTasks }}>
          <GoalsContext.Provider value={{ goals: dailyGoals }}>
            <div className='dashboard'>
              <h2>User: {user?.username}</h2>
              <h2>Email: {user?.email}</h2>
              <h2>User ID: {user_id}</h2>
              <h1>Tasks:</h1>
              <ul>
                {tasks.map((task, index) => (
                  <li key={index}>
                    {JSON.stringify(task?.title)}' '{task?._id}
                  </li>
                ))}
              </ul>
              <div className='container'>
                <DateDisplay date={todaysDate} />
                <TimeDisplay date={todaysDate} />
                <button onClick={handleReset}>Reset State</button>
              </div>
              <button onClick={handleLoadTasks}>Load Tasks</button>
              <Row className='row'>
                <TimerBox earningsChange={earningsChange} />
                {/* <SaveLoadButtons />
              <SaveLoad /> */}
              </Row>
              <Row className='row'>
                <Col className='col'>
                  <ProgressBox
                    goalsTotal={goalsTotal}
                    totalEarnings={totalEarnings}
                  />
                  <MonthlyProgressBox
                    goalsTotal={monthlyGoalsTotal}
                    totalEarnings={monthlyTotalEarnings}
                  />
                </Col>
              </Row>
              <Row>
                <CalendarBox handleSelectDate={handleSelectDate} />
              </Row>
              <Row className='row'>
                <TasksBox />
              </Row>
              <Row>
                <MonthlyGoalsBox total={monthlyGoalsTotal} />
                <GoalsBox total={goalsTotal} />
              </Row>
            </div>
          </GoalsContext.Provider>
        </TaskContext.Provider>
      </DateContext.Provider>
    </UserContext.Provider>
  );
};

export default Dashboard;
