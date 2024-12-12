import React from 'react';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
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
import { RemoveAction } from '../../app/tasksThunks';

interface DisplayKey {
  type: 'Currency' | 'String' | 'Duration' | 'Date';
}

interface ListItemProps {
  item: Item;
  removeAction: RemoveAction;
  displayKeys: Record<string, DisplayKey>;
}

const ListItem: React.FC<ListItemProps> = ({
  item,
  removeAction,
  displayKeys
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, user_id } = useContext(UserContext);

  const handleDelete = () => {
    if (!user_id || !user) {
      console.log('No user logged in');
      return;
    }
    dispatch(removeAction({ user_id, item_id: item.id }));
  };

  const itemType = (
    item: string | number | Date,
    displayKey: DisplayKey
  ): string => {
    switch (displayKey.type) {
      case 'Currency':
        return formatCurrency(item as number);
      case 'String':
        return item as string;
      case 'Duration':
        return formatDuration(item as number);
      case 'Date': {
        // Block scope for declaring const within case block
        const taskDate = new Date(item as Date);
        return formatHourMin(taskDate);
      }
      default:
        return item as string;
    }
  };

  return (
    <tr className='list-item'>
      <td>
        <DeleteButton onClick={handleDelete} aria-label='Delete'>
          <FaTrash />
        </DeleteButton>
      </td>
      {Object.keys(displayKeys)?.map((key, index) => (
        <td key={index} className='item-text'>
          <p>{itemType(item[key], displayKeys[key])}</p>
        </td>
      ))}
    </tr>
  );
};

export default ListItem;
