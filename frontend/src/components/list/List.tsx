import React from 'react';
import ListItem from './ListItem';
import './List.css';
import { Item } from '../../types/types';

interface DisplayKey {
  name: string;
  show: boolean;
  type: 'Currency' | 'String' | 'Duration' | 'Date';
}

interface ListProps {
  items: Item[];
  removeAction: any;
  displayKeys: Record<string, DisplayKey>;
}

const List: React.FC<ListProps> = ({ items, removeAction, displayKeys }) => {
  // Remove keys that are not meant to be displayed
  Object.keys(displayKeys).forEach((key) => {
    if (!displayKeys[key].show) delete displayKeys[key];
  });

  return (
    <div className='list-container'>
      <table>
        <colgroup>
          <col style={{ width: '5%', minWidth: '44px' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '15%' }} />
        </colgroup>
        <thead>
          <tr className='list-item'>
            <th className='list-item'></th>
            {Object.keys(displayKeys).map((key, index) => (
              <th key={index}>{displayKeys[key].name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <ListItem
              key={item.id}
              item={item}
              removeAction={removeAction}
              displayKeys={displayKeys}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
