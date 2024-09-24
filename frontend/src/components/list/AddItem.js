import { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { UserContext } from '../../contexts/context';

const AddItem = ({ addAction }) => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const dispatch = useDispatch();
  const { user, userId } = useContext(UserContext);

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
    setTitle('');
    setValue('');

    if (!userId || !user) {
      console.log('No user logged in');
      return;
    }
    dispatch(addAction(userId, newGoal));
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
