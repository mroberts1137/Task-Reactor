import ListItem from './ListItem';
import './List.css';

const List = ({ items, removeAction, displayKeys }) => {
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
          {items &&
            items.length > 0 &&
            items.map((item) => (
              <ListItem
                key={item._id}
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
