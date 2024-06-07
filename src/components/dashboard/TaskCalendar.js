import React, { useState } from 'react';
import WeekCalendar from 'react-week-calendar';
import { useSelector } from 'react-redux';
import { selectAllTasks } from '../../app/taskSlice';
import 'react-week-calendar/dist/style.css';
import moment from 'moment';

function TaskCalendar({ handleSelectDate }) {
  const [selectedDate, setSelectedDate] = useState(moment());
  const tasks = useSelector(selectAllTasks);

  const getTaskValueForDate = (date) => {
    if (tasks && tasks.taskArray) {
      const tasksForDate = tasks.taskArray.filter((task) => {
        const taskDate = moment(task.startTime);
        return (
          taskDate.isValid() &&
          taskDate.year() === date.year() &&
          taskDate.month() === date.month() &&
          taskDate.date() === date.date()
        );
      });
      return tasksForDate.reduce((total, task) => total + task.value, 0);
    }
    return 0;
  };

  const handleDateChange = (date) => {
    setSelectedDate(moment(date));
    handleSelectDate(date);
  };

  const renderEvent = (date) => {
    const dailyTotal = getTaskValueForDate(date);
    return {
      start: moment(date).startOf('day'),
      end: moment(date).endOf('day'),
      value: dailyTotal > 0 ? `$${dailyTotal.toFixed(2)}` : ''
    };
  };

  const currentWeekEvents = [];
  for (let i = 0; i < 7; i++) {
    const date = moment(selectedDate).startOf('week').add(i, 'days');
    currentWeekEvents.push(renderEvent(date));
  }

  return (
    <div>
      <WeekCalendar
        firstDay={moment(selectedDate).startOf('week')}
        numberOfDays={7}
        selectedIntervals={currentWeekEvents}
        onIntervalSelect={(interval) =>
          handleDateChange(interval.start.toDate())
        }
        scaleUnit={60}
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
