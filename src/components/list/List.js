import ListItem from './ListItem';
import './List.css';

const List = ({ items, removeItem, displayKeys }) => {
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
              <th key={index}>-{key}-</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              removeItem={removeItem}
              displayKeys={displayKeys}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
