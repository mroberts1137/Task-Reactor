import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Context
import {
  UserContext,
  TaskContext,
  DailyGoalsContext,
  MonthlyGoalsContext,
  DateContext,
  EarningsContext
} from './context';
// Types
import { User, Task, Goal } from '../types/types';
import { AppDispatch, RootState } from '../app/store';
// Redux
import { selectUserId, selectUser } from '../app/userSlice';
import {
  fetchTasks,
  selectAllTasks,
  selectTasksByDate,
  selectAllTasksByMonth
} from '../app/tasksSlice';
import { fetchDailyGoals, selectAllGoals } from '../app/dailyGoalsSlice';
import {
  fetchMonthlyGoals,
  selectAllGoals as selectAllMonthlyGoals
} from '../app/monthlyGoalsSlice';
import { sumTotal } from '../utils/functions';

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();

  /**
   * USER
   */

  const user_id: string = useSelector(selectUserId);
  const user: User | null = useSelector(selectUser);

  // Fetch user tasks/goals when logging in
  useEffect(() => {
    if (user && user_id) {
      dispatch(fetchTasks({ user_id }));
      dispatch(fetchDailyGoals({ user_id }));
      dispatch(fetchMonthlyGoals({ user_id }));
    }
  }, [dispatch, user, user_id]);

  /**
   * DATE
   */

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const todaysDate = new Date();

  /**
   * TASKS
   */

  const tasks: Task[] = useSelector(selectAllTasks);
  const dailyTasks: Task[] = useSelector((state: RootState) =>
    selectTasksByDate(state, selectedDate)
  );
  const monthlyTasks: Task[] = useSelector((state: any) =>
    selectAllTasksByMonth(state, selectedDate)
  );

  /**
   * GOALS
   */

  const dailyGoals: Goal[] = useSelector(selectAllGoals);
  const monthlyGoals: Goal[] = useSelector(selectAllMonthlyGoals);
  const [dailyTotalGoals, setDailyTotalGoals] = useState<number>(0);
  const [monthlyTotalGoals, setMonthlyTotalGoals] = useState<number>(0);

  // Sum daily goals values
  useEffect(() => {
    setDailyTotalGoals(sumTotal(dailyGoals.map((item) => item.value)));
  }, [dailyGoals]);

  // Sum monthly goals values
  useEffect(() => {
    setMonthlyTotalGoals(sumTotal(monthlyGoals.map((item) => item.value)));
  }, [monthlyGoals]);

  /**
   * DAILY/MONTHLY EARNINGS
   */

  const [dailyTasksEarnings, setDailyTasksEarnings] = useState<number>(0);
  const [currentTaskEarnings, setCurrentTaskEarnings] = useState<number>(0);
  const [dailyTotalEarnings, setDailyTotalEarnings] = useState<number>(0);
  const [monthlyTotalEarnings, setMonthlyTotalEarnings] = useState<number>(0);

  // Sum daily tasks net income
  useEffect(() => {
    setDailyTasksEarnings(sumTotal(dailyTasks.map((item) => item.netIncome)));
  }, [dailyTasks]);

  // Set total daily earnings
  useEffect(() => {
    setDailyTotalEarnings(dailyTasksEarnings + currentTaskEarnings);
  }, [dailyTasksEarnings, currentTaskEarnings]);

  // Set monthly tasks net income
  useEffect(() => {
    setMonthlyTotalEarnings(
      sumTotal(monthlyTasks.map((item) => item.netIncome))
    );
  }, [monthlyTasks]);

  const earningsChange = useCallback((val: number) => {
    setCurrentTaskEarnings(val);
  }, []);

  //////////////////////////////

  return (
    <UserContext.Provider value={{ user, user_id }}>
      <DateContext.Provider
        value={{ todaysDate, selectedDate, setSelectedDate }}
      >
        <TaskContext.Provider
          value={{
            tasks,
            dailyTasks,
            monthlyTasks
          }}
        >
          <EarningsContext.Provider
            value={{
              dailyTasksEarnings,
              dailyTotalEarnings,
              monthlyTotalEarnings,
              earningsChange
            }}
          >
            <DailyGoalsContext.Provider value={{ dailyGoals, dailyTotalGoals }}>
              <MonthlyGoalsContext.Provider
                value={{ monthlyGoals, monthlyTotalGoals }}
              >
                {children}
              </MonthlyGoalsContext.Provider>
            </DailyGoalsContext.Provider>
          </EarningsContext.Provider>
        </TaskContext.Provider>
      </DateContext.Provider>
    </UserContext.Provider>
  );
};

export default ContextProvider;
