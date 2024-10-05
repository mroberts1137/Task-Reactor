import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row, Button } from 'reactstrap';
// Components
import GoalsBox from '../goalsbox/GoalsBox';
import MonthlyGoalsBox from '../goalsbox/MonthlyGoalsBox';
import TasksBox from '../taskbox/TasksBox';
import TimerBox from '../timerbox/TimerBox';
import ProgressBox from '../progressbox/ProgressBox';
import MonthlyProgressBox from '../progressbox/MonthlyProgressBox';
import CalendarBox from '../calendarbox/CalendarBox';
import DateDisplay from '../DateDisplay';
import TimeDisplay from '../TimeDisplay';
// Types
import { User, Task, Goal } from '../../types/types';
import { AppDispatch, RootState } from '../../app/store';
// Context
import {
  UserContext,
  TaskContext,
  GoalsContext,
  DateContext
} from '../../contexts/context';
// CSS
import './Dashboard.css';
// Redux
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

/**
 * Dashboard
 */

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loggedin_userId: string = useSelector(selectUserId);
  const loggedin_user: User = useSelector(selectUser);

  // User
  const [user, setUser] = useState<User | null>(null);
  const [user_id, setUserId] = useState<string | null>(null);
  // Daily Earnings
  const [dailyTasksEarnings, setDailyTasksEarnings] = useState<number>(0);
  const [currentTaskEarnings, setCurrentTaskEarnings] = useState<number>(0);
  const [totalDailyEarnings, setTotalDailyEarnings] = useState<number>(0);
  // Date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const todaysDate = new Date();
  //Goals
  const dailyGoals: Goal[] = useSelector(selectAllGoals);
  const monthlyGoals: Goal[] = useSelector(selectAllMonthlyGoals);
  const [dailyGoalsTotal, setDailyGoalsTotal] = useState<number>(0);
  const [monthlyGoalsTotal, setMonthlyGoalsTotal] = useState<number>(0);
  // Tasks
  const tasks: Task[] = useSelector(selectAllTasks);
  const dailyTasks: Task[] = useSelector((state: RootState) =>
    selectTasksByDate(state, selectedDate)
  );
  const monthlyTasks: Task[] = useSelector((state: any) =>
    selectAllTasksByMonth(state, selectedDate)
  );

  useEffect(() => {
    if (loggedin_userId && loggedin_user) {
      setUser(loggedin_user);
      setUserId(loggedin_userId);
      dispatch(fetchTasks({ user_id: loggedin_userId }));
    }
  }, [loggedin_userId, loggedin_user]);

  useEffect(() => {
    setDailyGoalsTotal(
      sumTotal(dailyGoals.map((item) => parseFloat(item.value)))
    );
  }, [dailyGoals]);

  useEffect(() => {
    setMonthlyGoalsTotal(
      sumTotal(monthlyGoals.map((item) => parseFloat(item.value)))
    );
  }, [monthlyGoals]);

  useEffect(() => {
    setDailyTasksEarnings(sumTotal(dailyTasks.map((item) => item.netIncome)));
  }, [dailyTasks]);

  useEffect(() => {
    setTotalDailyEarnings(dailyTasksEarnings + currentTaskEarnings);
  }, [dailyTasksEarnings, currentTaskEarnings]);

  const handleReset = () => {
    dispatch(reset());
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const earningsChange = useCallback((val: number) => {
    setCurrentTaskEarnings(val);
  }, []);

  const monthlyTotalEarnings = sumTotal(
    monthlyTasks.map((item) => item.netIncome)
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
                {tasks.map((task: Task, index: number) => (
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
              </Row>
              <Row className='row'>
                <Col className='col'>
                  <ProgressBox
                    goalsTotal={dailyGoalsTotal}
                    totalEarnings={totalDailyEarnings}
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
                <GoalsBox total={dailyGoalsTotal} />
              </Row>
            </div>
          </GoalsContext.Provider>
        </TaskContext.Provider>
      </DateContext.Provider>
    </UserContext.Provider>
  );
};

export default Dashboard;
