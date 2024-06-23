import { useContext } from 'react';
import TaskCalendar from './TaskCalendar';
import DateDisplay from '../DateDisplay';
import { DateContext } from '../../contexts/context';

const CalendarBox = ({ handleSelectDate }) => {
  const { selectedDate, todaysDate } = useContext(DateContext);

  return (
    <div className='container'>
      <p>
        Selected Date: <DateDisplay date={selectedDate} />
      </p>
      <TaskCalendar handleSelectDate={handleSelectDate} />
    </div>
  );
};

export default CalendarBox;
