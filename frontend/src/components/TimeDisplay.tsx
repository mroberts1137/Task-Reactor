const TimeDisplay = ({ date }) => {
  return (
    <h3>
      {date.getHours()}:{date.getMinutes().toString().padStart(2, '0')}
    </h3>
  );
};

export default TimeDisplay;
