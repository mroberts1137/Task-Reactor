import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../app/taskReducer';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [rate, setRate] = useState(0);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    // if (!title || !value || value <= 0 || !duration) {
    //   console.log('Invalid input');
    //   return;
    // }

    const newTask = {
      title,
      value,
      duration,
      startTime: null,
      endTime: null,
      rate
    };
    dispatch(addTask(newTask));
    setTitle('');
    setValue(0);
    setDuration(0);
    setRate(0);
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
        <label htmlFor='value'>Total Value: $</label>
        <input
          type='text'
          onChange={(e) => setValue(e.target.value)}
          value={value}
          name='value'
          className='short-input'
        />
        <label htmlFor='duration'>Duration: </label>
        <input
          type='text'
          onChange={(e) => setDuration(e.target.value)}
          value={duration}
          name='duration'
          className='long-input'
        />
        <label htmlFor='rate'>Rate: $</label>
        <input
          type='text'
          onChange={(e) => setRate(e.target.value)}
          value={rate}
          name='rate'
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
