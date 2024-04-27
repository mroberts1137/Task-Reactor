import ListItem from './ListItem';

const List = ({ items }) => {
  return (
    <div>
      {items.map((item) => {
        return <ListItem key={item.id} item={item} />;
      })}
    </div>
  );
};

export default List;
