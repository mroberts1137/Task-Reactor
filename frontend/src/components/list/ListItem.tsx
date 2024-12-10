import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import { UserContext } from '../../contexts/context';
import { AppDispatch } from '../../app/store';
import { Item } from '../../types/types';
import {
  formatHourMin,
  formatDuration,
  formatCurrency
} from '../../utils/time_box_functions';
import { FaTrash } from 'react-icons/fa';
import { DeleteButton } from '../../styles/components/Button';

interface DisplayKey {
  type: 'Currency' | 'String' | 'Duration' | 'Date';
}

interface ListItemProps {
  item: Item;
  removeAction: any;
  displayKeys: Record<string, DisplayKey>;
}

const ListItem: React.FC<ListItemProps> = ({
  item,
  removeAction,
  displayKeys
}) => {
  const dispatch = useDispatch<AppDispatch>();
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
    dispatch(removeAction({ user_id, item_id: item.id }));
  };

  const itemType = (item: any, displayKey: DisplayKey) => {
    switch (displayKey.type) {
      case 'Currency':
        return formatCurrency(item);
      case 'String':
        return item;
      case 'Duration':
        return formatDuration(item);
      case 'Date': {
        // Block scope for declaring const within case block
        const taskDate = new Date(item);
        return formatHourMin(taskDate);
      }
      default:
        return item;
    }
  };

  return (
    <animated.tr className='list-item' style={slideIn}>
      <td>
        <DeleteButton onClick={handleDelete}>
          <FaTrash />
        </DeleteButton>
      </td>
      {Object.keys(displayKeys)?.map((key, index) => (
        <td key={index} className='item-text'>
          {itemType(item[key], displayKeys[key])}
        </td>
      ))}
    </animated.tr>
  );
};

export default ListItem;
