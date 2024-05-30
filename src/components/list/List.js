import ListItem from './ListItem';

const List = ({ items, removeItem, displayKeys }) => {
  return (
    <div>
      <table>
        <thead>
          <tr className='list-item'>
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
