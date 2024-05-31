import ListItem from './ListItem';

const List = ({ items, removeItem, displayKeys }) => {
  return (
    <div>
      <table>
        <colgroup>
          <col style={{ width: '15%' }} />
          <col style={{ width: '30%' }} />
          <col style={{ width: '20%' }} />
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
