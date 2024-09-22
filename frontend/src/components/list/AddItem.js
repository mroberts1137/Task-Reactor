import { useState } from 'react';
import { useDispatch } from 'react-redux';

const AddItem = ({ addAction }) => {
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
    dispatch(addAction(newGoal));
    setTitle('');
    setValue('');
  };

  return (
    <div className='input-container'>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default AddItem;
