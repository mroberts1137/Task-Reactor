import ListItem from './ListItem';

const List = ({ items, removeItem, displayKeys }) => {
  return (
    <div>
      <table>
        <tr className='list-item'>
          {Object.keys(displayKeys).map((key) => (
            <th>-{key}-</th>
          ))}
        </tr>
        {items.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            removeItem={removeItem}
            displayKeys={displayKeys}
          />
        ))}
      </table>
    </div>
  );
};

export default List;
