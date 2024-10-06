import { useContext } from 'react';
import TaskCalendar from './TaskCalendar';
import DateDisplay from '../DateDisplay';
import { DateContext } from '../../contexts/context';

const CalendarBox = () => {
  const { todaysDate, selectedDate } = useContext(DateContext);

  return (
    <div className='container'>
      <p>Selected Date: </p>
      <DateDisplay date={selectedDate} />
      <p>Today's Date: </p>
      <DateDisplay date={todaysDate} />
      <TaskCalendar />
    </div>
  );
};

export default CalendarBox;
