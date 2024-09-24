import { useContext } from 'react';
import TaskCalendar from './TaskCalendar';
import DateDisplay from '../DateDisplay';
import { DateContext } from '../../contexts/context';

const CalendarBox = ({ handleSelectDate }) => {
  const { selectedDate, todaysDate } = useContext(DateContext);

  return (
    <div className='container'>
      <p>Selected Date: </p>
      <DateDisplay date={selectedDate} />
      <p>Today's Date: </p>
      <DateDisplay date={todaysDate} />
      <TaskCalendar handleSelectDate={handleSelectDate} />
    </div>
  );
};

export default CalendarBox;
