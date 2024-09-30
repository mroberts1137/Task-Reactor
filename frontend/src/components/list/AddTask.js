import { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../app/tasksSlice';
import { UserContext } from '../../contexts/context';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [rate, setRate] = useState(0);
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
      value: parseFloat(value) || 0,
      duration: parseFloat(duration) || 0,
      startTime: startTime || new Date(),
      endTime: endTime || new Date(),
      rate: parseFloat(rate) || 0
    };

    dispatch(addTask({ user_id, item: newTask }));
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
