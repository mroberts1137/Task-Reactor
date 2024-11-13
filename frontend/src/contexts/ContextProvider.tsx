import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { AppDispatch, RootState } from '../app/store';
// Redux
import { selectUserId, selectUser } from '../app/userSlice';
import {
  selectAllTasks,
  selectTasksByDate,
  selectAllTasksByMonth
} from '../app/tasksSlice';
import { sumTotal } from '../utils/functions';
import { selectAllDailyGoals } from '../app/dailyGoalsSlice';
import { selectAllMonthlyGoals } from '../app/monthlyGoalsSlice';
import { fetchTasks } from '../app/tasksThunks';
import { fetchDailyGoals } from '../app/dailyGoalsThunks';
import { fetchMonthlyGoals } from '../app/monthlyGoalsThunks';

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();

  // User selectors with memoization
  const user_id = useSelector(selectUserId);
  const user = useSelector(selectUser);

  // Date state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const todaysDate = useMemo(() => new Date(), []);

  // Tasks selectors with memoization
  const tasks = useSelector(selectAllTasks);
  const dailyTasks = useSelector((state: RootState) =>
    selectTasksByDate(state, selectedDate)
  );
  const monthlyTasks = useSelector((state: RootState) =>
    selectAllTasksByMonth(state, selectedDate)
  );

  // Goals selectors with memoization
  const dailyGoals = useSelector(selectAllDailyGoals);
  const monthlyGoals = useSelector(selectAllMonthlyGoals);

  //
  const userStatus = useSelector((state: RootState) => state.user.status);
  const userError = useSelector((state: RootState) => state.user.error);
  const tasksStatus = useSelector((state: RootState) => state.tasks.status);
  const tasksError = useSelector((state: RootState) => state.tasks.error);
  const dailyGoalsStatus = useSelector(
    (state: RootState) => state.dailyGoals.status
  );
  const dailyGoalsError = useSelector(
    (state: RootState) => state.dailyGoals.error
  );
  const monthlyGoalsStatus = useSelector(
    (state: RootState) => state.monthlyGoals.status
  );
  const monthlyGoalsError = useSelector(
    (state: RootState) => state.monthlyGoals.error
  );

  // Calculate totals with useMemo
  const dailyTotalGoals = useMemo(
    () => sumTotal(dailyGoals.map((item) => item.value)),
    [dailyGoals]
  );

  const monthlyTotalGoals = useMemo(
    () => sumTotal(monthlyGoals.map((item) => item.value)),
    [monthlyGoals]
  );

  // Earnings calculations with useMemo
  const [currentTaskEarnings, setCurrentTaskEarnings] = useState<number>(0);

  const dailyTasksEarnings = useMemo(
    () => sumTotal(dailyTasks.map((item) => item.netIncome)),
    [dailyTasks]
  );

  const dailyTotalEarnings = useMemo(
    () => dailyTasksEarnings + currentTaskEarnings,
    [dailyTasksEarnings, currentTaskEarnings]
  );

  const monthlyTotalEarnings = useMemo(
    () => sumTotal(monthlyTasks.map((item) => item.netIncome)),
    [monthlyTasks]
  );

  const earningsChange = useCallback((val: number) => {
    setCurrentTaskEarnings(val);
  }, []);

  // Fetch data when user changes
  useEffect(() => {
    if (user && user_id) {
      dispatch(fetchTasks({ user_id }));
      dispatch(fetchDailyGoals({ user_id }));
      dispatch(fetchMonthlyGoals({ user_id }));
    }
  }, [dispatch, user, user_id]);

  // Memoize context values
  const userContextValue = useMemo(
    () => ({
      user,
      user_id,
      isLoading: userStatus === 'loading',
      error: userError
    }),
    [user, user_id, userStatus, userError]
  );
  const dateContextValue = useMemo(
    () => ({ todaysDate, selectedDate, setSelectedDate }),
    [todaysDate, selectedDate]
  );
  const taskContextValue = useMemo(
    () => ({
      tasks,
      dailyTasks,
      monthlyTasks,
      isLoading: tasksStatus === 'loading',
      error: tasksError
    }),
    [tasks, dailyTasks, monthlyTasks, tasksStatus, tasksError]
  );
  const earningsContextValue = useMemo(
    () => ({
      dailyTasksEarnings,
      dailyTotalEarnings,
      monthlyTotalEarnings,
      earningsChange
    }),
    [dailyTasksEarnings, dailyTotalEarnings, monthlyTotalEarnings]
  );
  const dailyGoalsContextValue = useMemo(
    () => ({
      dailyGoals,
      dailyTotalGoals,
      isLoading: dailyGoalsStatus === 'loading',
      error: dailyGoalsError
    }),
    [dailyGoals, dailyTotalGoals, dailyGoalsStatus, dailyGoalsError]
  );
  const monthlyGoalsContextValue = useMemo(
    () => ({
      monthlyGoals,
      monthlyTotalGoals,
      isLoading: monthlyGoalsStatus === 'loading',
      error: monthlyGoalsError
    }),
    [monthlyGoals, monthlyTotalGoals, monthlyGoalsStatus, monthlyGoalsError]
  );

  return (
    <UserContext.Provider value={userContextValue}>
      <DateContext.Provider value={dateContextValue}>
        <TaskContext.Provider value={taskContextValue}>
          <EarningsContext.Provider value={earningsContextValue}>
            <DailyGoalsContext.Provider value={dailyGoalsContextValue}>
              <MonthlyGoalsContext.Provider value={monthlyGoalsContextValue}>
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
