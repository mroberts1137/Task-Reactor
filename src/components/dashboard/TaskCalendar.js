import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useSelector } from 'react-redux';
import { selectTasksByDate } from '../../app/taskSlice';

function TaskCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const tasks = useSelector((state) => selectTasksByDate(state, selectedDate));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getTaskValueForDate = (date) => {
    const tasksForDate = useSelector((state) => selectTasksByDate(state, date));
    return tasksForDate.reduce((acc, task) => acc + task.value, 0);
  };

  const renderDay = ({ date, view }) => {
    if (view === 'month') {
      return (
        <div>
          {date.getDate()}
          <br />
          {getTaskValueForDate(date)}
        </div>
      );
    }
    return <div>{date.getDate()}</div>;
  };

  return (
    <div>
      <Calendar
        value={selectedDate}
        onChange={handleDateChange}
        formatDay={(locale, date) => date.getDate()}
        tileContent={renderDay}
      />
    </div>
  );
}

export default TaskCalendar;
