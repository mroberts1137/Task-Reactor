import { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { UserContext } from '../../contexts/context';
import { useSpring, animated } from 'react-spring';
import {
  formatHourMin,
  formatDuration,
  formatCurrency
} from '../../utils/time_box_functions';

const ListItem = ({ item, removeAction, displayKeys }) => {
  const dispatch = useDispatch();
  const [animate, setAnimate] = useState(false);
  const { user, user_id } = useContext(UserContext);

  const slideIn = useSpring({
    opacity: animate ? 1 : 0,
    transform: animate ? 'translateX(0%)' : 'translateX(100%)',
    config: { duration: 200, mass: 5, friction: 20, tension: 120 }
  });

  useEffect(() => setAnimate(true), []);

  const handleDelete = () => {
    if (!user_id || !user) {
      console.log('No user logged in');
      return;
    }
    dispatch(removeAction({ user_id, item_id: item._id }));
  };

  const itemType = (item, displayKey) => {
    switch (displayKey.type) {
      case 'Currency':
        return formatCurrency(parseFloat(item));
      case 'String':
        return item;
      case 'Duration':
        return formatDuration(item);
      case 'Date':
        const taskDate = new Date(item);
        return formatHourMin(taskDate);
      default:
        return item;
    }
  };

  return (
    <animated.tr className='list-item' style={slideIn}>
      <td>
        <button className='remove-item-btn' onClick={handleDelete}>
          X
        </button>
      </td>
      {Object.keys(displayKeys).map((key, index) => (
        <td key={index} className='item-text'>
          {itemType(item[key], displayKeys[key])}
        </td>
      ))}
    </animated.tr>
  );
};

export default ListItem;
