import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addGoal } from '../../app/goalsReducer';

const AddItem = () => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !value || value < 0) {
      console.log('Invalid input');
      return;
    }

    const newGoal = {
      title,
      value
    };
    dispatch(addGoal(newGoal));
    setTitle('');
    setValue('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex-row'
      style={{ alignItems: 'center' }}
    >
      <label htmlFor='title'>Title: </label>
      <input
        type='text'
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        name='title'
        className='long-input'
      />
      <label htmlFor='value'>Value: </label>
      <input
        type='text'
        onChange={(e) => setValue(e.target.value)}
        value={value}
        name='value'
        className='short-input'
      />
      <button className='add-item-btn' type='submit'>
        +
      </button>
    </form>
  );
};

export default AddItem;
