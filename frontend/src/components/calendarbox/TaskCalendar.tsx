import { useMemo, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import './TaskCalendar.css';
import { DateContext, TaskContext } from '../../contexts/context';
import { formatCurrency } from '../../utils/time_box_functions';

import { Task } from '../../types/types';

function TaskCalendar() {
  const { selectedDate, setSelectedDate } = useContext(DateContext);
  const { tasks }: { tasks: Task[] } = useContext(TaskContext);

  const getTasksByDay = useMemo(() => {
    const taskMap = new Map();

    if (tasks) {
      tasks.forEach((task) => {
        const taskDate = moment(task.startTime);
        if (taskDate.isValid()) {
          const key = taskDate.startOf('day').format();
          if (!taskMap.has(key)) {
            taskMap.set(key, []);
          }
          taskMap.get(key).push(task);
        }
      });
    }
    return taskMap;
  }, [tasks]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const renderEventsForMonth = () => {
    const events = [];
    const startOfMonth = moment(selectedDate).startOf('month');

    for (let day = 0; day < startOfMonth.daysInMonth(); day++) {
      const dateKey = moment(startOfMonth)
        .add(day, 'days')
        .startOf('day')
        .format();
      const tasksForDay = getTasksByDay.get(dateKey) || [];
      const totalNetIncome = tasksForDay.reduce(
        (total: number, task: Task) => total + task.netIncome,
        0
      );

      if (totalNetIncome > 0) {
        events.push({
          date: moment(startOfMonth).add(day, 'days').toDate(),
          netIncome: totalNetIncome
        });
      }
    }

    return events;
  };

  const tileContent = ({ date }) => {
    const events = renderEventsForMonth();
    const event = events.find((event) =>
      moment(event.date).isSame(date, 'day')
    );
    return event ? (
      <div className='content'>{formatCurrency(event.netIncome)}</div>
    ) : null;
  };

  return (
    <div>
      <Calendar
        value={selectedDate}
        onClickDay={(date) => handleDateChange(date)}
        tileContent={tileContent}
        showNeighboringMonth={true}
        calendarType='gregory'
      />
    </div>
  );
}

export default TaskCalendar;
