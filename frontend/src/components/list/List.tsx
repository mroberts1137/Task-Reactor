import React, { useState } from 'react';
import ListItem from './ListItem';
import { Item } from '../../types/types';
import './List.css';
import { ResizableHeader, Table } from '../../styles/components/Table';

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
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    {}
  );

  // Remove keys that are not meant to be displayed
  const visibleKeys = Object.keys(displayKeys).filter(
    (key) => displayKeys[key].show
  );

  Object.keys(displayKeys).forEach((key) => {
    if (!displayKeys[key].show) delete displayKeys[key];
  });

  const onResize =
    (index: number) =>
    (e: any, { size }: any) => {
      setColumnWidths((prevWidths) => ({
        ...prevWidths,
        [index]: size.width
      }));
    };

  return (
    <Table>
      <thead>
        <tr>
          <th style={{ width: '44px' }}></th>
          {visibleKeys?.map((key, index) => (
            <ResizableHeader
              key={index}
              width={columnWidths[index] || 150}
              height={0}
              onResize={onResize(index)}
            >
              <th style={{ width: columnWidths[index] || 150 }}>
                {displayKeys[key].name}
              </th>
            </ResizableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            removeAction={removeAction}
            displayKeys={displayKeys}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default List;
