// import React, { useState } from 'react';
// import WeekCalendar from 'react-week-calendar';
// import { useSelector } from 'react-redux';
// import { selectTasksByDate } from '../../app/taskSlice';

// function WeeklyCalendar() {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const tasks = useSelector((state) => selectTasksByDate(state, selectedDate));

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   const getTaskValueForDate = (date) => {
//     // const tasksForDate = selectTasksByDate(state, date);
//     return tasks.reduce((acc, task) => acc + task.value, 0);
//   };

//   const renderDay = (date) => {
//     return (
//       <div>
//         {date.getDate()}
//         <br />
//         {getTaskValueForDate(date)}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <WeekCalendar
//         firstDay={selectedDate}
//         onDateChange={handleDateChange}
//         dayRenderer={renderDay}
//       />
//     </div>
//   );
// }

// export default WeeklyCalendar;
