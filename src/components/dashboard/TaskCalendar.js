import React, { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import { useSelector } from 'react-redux';
import { selectAllTasks } from '../../app/taskSlice';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import './TaskCalendar.css';

function TaskCalendar({ handleSelectDate }) {
  const [selectedDate, setSelectedDate] = useState(moment());
  const tasks = useSelector(selectAllTasks);

  const getTasksByDay = useMemo(() => {
    const taskMap = new Map();

    if (tasks && tasks.taskArray) {
      tasks.taskArray.forEach((task) => {
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

  const handleDateChange = (date) => {
    setSelectedDate(moment(date));
    handleSelectDate(date);
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
      const totalValue = tasksForDay.reduce(
        (total, task) => total + task.value,
        0
      );

      if (totalValue > 0) {
        events.push({
          date: moment(startOfMonth).add(day, 'days').toDate(),
          value: totalValue
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
      <div className='content'>${event.value.toFixed(2)}</div>
    ) : null;
  };

  return (
    <div>
      <Calendar
        value={selectedDate.toDate()}
        onClickDay={(date) => handleDateChange(date)}
        tileContent={tileContent}
        showNeighboringMonth={true}
        calendarType='gregory'
      />
    </div>
  );
}

export default TaskCalendar;
