import { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../app/tasksSlice';
import { UserContext } from '../../contexts/context';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [netIncome, setNetIncome] = useState(0);
  const [grossIncome, setGrossIncome] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [hourlyRate, setHourlyRate] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const dispatch = useDispatch();
  const { user, user_id } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user_id || !user) {
      console.log('No user logged in');
      return;
    }

    // if (!title || !value || value <= 0 || !duration) {
    //   console.log('Invalid input');
    //   return;
    // }

    const newTask = {
      title: title || '',
      netIncome: parseFloat(netIncome) || 0,
      grossIncome: parseFloat(grossIncome) || 0,
      duration: parseFloat(duration) || 0,
      startTime: startTime || new Date(),
      endTime: endTime || new Date(),
      hourlyRate: parseFloat(hourlyRate) || 0,
      taxRate: parseFloat(taxRate) || 0
    };

    dispatch(addTask({ user_id, item: newTask }));
    setTitle('');
    setNetIncome(0);
    setGrossIncome(0);
    setDuration(0);
    setHourlyRate(0);
    setTaxRate(0);
  };

  return (
    <div className='input-container'>
      <form onSubmit={handleSubmit}>
        <label htmlFor='title'>Task: </label>
        <input
          type='text'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          name='title'
          className='long-input'
        />
        <label htmlFor='value'>Net Income: $</label>
        <input
          type='text'
          onChange={(e) => setNetIncome(parseFloat(e.target.value))}
          value={netIncome}
          name='value'
          className='short-input'
        />
        <label htmlFor='duration'>Duration: </label>
        <input
          type='text'
          onChange={(e) => setDuration(parseFloat(e.target.value))}
          value={duration}
          name='duration'
          className='long-input'
        />
        <label htmlFor='rate'>Rate: $</label>
        <input
          type='text'
          onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
          value={hourlyRate}
          name='rate'
          className='short-input'
        />
        <label htmlFor='startTime'>Start Time: </label>
        <input
          type='text'
          onChange={(e) => setStartTime(e.target.value)}
          value={startTime}
          name='startTime'
          className='short-input'
        />
        <label htmlFor='endTime'>End Time: </label>
        <input
          type='text'
          onChange={(e) => setEndTime(e.target.value)}
          value={endTime}
          name='endTime'
          className='short-input'
        />
        <button className='add-item-btn' type='submit'>
          +
        </button>
      </form>
    </div>
  );
};

export default AddTask;
