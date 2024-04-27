import ListItem from './ListItem';

const List = ({ items, removeItem }) => {
  return (
    <div>
      {items.map((item) => {
        return <ListItem key={item.id} item={item} removeItem={removeItem} />;
      })}
    </div>
  );
};

export default List;
