import { month } from '../utils/functions';

const DateDisplay = ({ date }) => {
  return (
    <h3>
      {month[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
    </h3>
  );
};

export default DateDisplay;
