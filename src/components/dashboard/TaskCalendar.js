import React, { useState, useMemo } from 'react';
import WeekCalendar from 'react-week-calendar';
import { useSelector } from 'react-redux';
import { selectAllTasks } from '../../app/taskSlice';
import 'react-week-calendar/dist/style.css';
import moment from 'moment';

function TaskCalendar({ handleSelectDate }) {
  const [selectedDate, setSelectedDate] = useState(moment());
  const tasks = useSelector(selectAllTasks);

  const getTasksByHour = useMemo(() => {
    const taskMap = new Map();

    if (tasks && tasks.taskArray) {
      tasks.taskArray.forEach((task) => {
        const taskDate = moment(task.startTime);
        if (taskDate.isValid()) {
          const key = taskDate.startOf('hour').format();
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

  const renderEventsForWeek = () => {
    const events = [];
    const startOfWeek = moment(selectedDate).startOf('week');

    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const dateKey = moment(startOfWeek)
          .add(day, 'days')
          .startOf('hour')
          .add(hour, 'hours')
          .format();
        const tasksForHour = getTasksByHour.get(dateKey) || [];
        const totalValue = tasksForHour.reduce(
          (total, task) => total + task.value,
          0
        );

        if (totalValue > 0) {
          events.push({
            start: moment(startOfWeek)
              .add(day, 'days')
              .startOf('hour')
              .add(hour, 'hours'),
            end: moment(startOfWeek)
              .add(day, 'days')
              .startOf('hour')
              .add(hour + 1, 'hours'),
            value: totalValue
          });
        }
      }
    }

    return events;
  };

  return (
    <div>
      <WeekCalendar
        firstDay={moment(selectedDate).startOf('week')}
        numberOfDays={7}
        selectedIntervals={renderEventsForWeek()}
        onIntervalSelect={(interval) =>
          handleDateChange(interval.start.toDate())
        }
        scaleUnit={60}
        eventComponent={({ value }) => <div>{value}</div>}
      />
    </div>
  );
}

export default TaskCalendar;

// import React, { useState } from 'react';
// import Calendar from 'react-calendar';
// import { useSelector } from 'react-redux';
// import { selectTasksByDate, selectAllTasks } from '../../app/taskSlice';

// function TaskCalendar({ handleSelectDate }) {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const tasks = useSelector(selectAllTasks);
//   // const tasks = useSelector((state) => selectTasksByDate(state, selectedDate));

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     handleSelectDate(date);
//   };

//   const getTaskValueForDate = (date) => {
//     if (tasks && tasks.taskArray) {
//       const tasksForDate = tasks.taskArray.filter((task) => {
//         const taskDate = new Date(task.startTime);
//         return (
//           taskDate instanceof Date &&
//           !isNaN(taskDate) &&
//           taskDate.getFullYear() === date.getFullYear() &&
//           taskDate.getMonth() === date.getMonth() &&
//           taskDate.getDate() === date.getDate()
//         );
//       });
//       return tasksForDate.reduce((total, task) => total + task.value, 0);
//     }
//     return 0;
//   };

//   const renderDay = ({ date, view }) => {
//     const dailyTotal = getTaskValueForDate(date);
//     if (view === 'month') {
//       return <div>{dailyTotal > 0 ? `$${dailyTotal.toFixed(2)}` : ''}</div>;
//     }
//     return <div>{date.getDate()}</div>;
//   };

//   return (
//     <div>
//       <Calendar
//         value={selectedDate}
//         onChange={handleDateChange}
//         formatDay={(locale, date) => date.getDate()}
//         tileContent={renderDay}
//       />
//     </div>
//   );
// }

// export default TaskCalendar;
