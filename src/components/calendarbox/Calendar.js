import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTasksByDate } from '../../app/taskSlice';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const tasks = useSelector((state) => selectTasksByDate(state, selectedDate));

  const getWeekDays = (date) => {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(date);
      day.setDate(day.getDate() + i - day.getDay());
      weekDays.push(day);
    }
    return weekDays;
  };

  const getDayTasksValue = (date) => {
    // const dayTasks = useSelector((state) => selectTasksByDate(state, date));
    return tasks.reduce((total, task) => total + task.value, 0);
  };

  const handleNextWeek = () => {
    setSelectedDate((prevDate) => {
      const nextDate = new Date(prevDate);
      nextDate.setDate(nextDate.getDate() + 7);
      return nextDate;
    });
  };

  const handlePrevWeek = () => {
    setSelectedDate((prevDate) => {
      const prevWeekDate = new Date(prevDate);
      prevWeekDate.setDate(prevWeekDate.getDate() - 7);
      return prevWeekDate;
    });
  };

  const weekDays = getWeekDays(selectedDate);

  return (
    <div>
      <button onClick={handlePrevWeek}>Prev</button>
      <div style={{ display: 'flex' }}>
        {weekDays.map((day, index) => (
          <div
            key={index}
            style={{
              width: '100px',
              border: '1px solid black',
              textAlign: 'center'
            }}
          >
            <p>{day.toLocaleDateString()}</p>
            <p>{getDayTasksValue(day)}</p>
          </div>
        ))}
      </div>
      <button onClick={handleNextWeek}>Next</button>
    </div>
  );
};

export default Calendar;
