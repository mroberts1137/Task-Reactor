const DropdownSelector = ({ items, selectedItems, onToggle }) => {
  return (
    <div className='dropdown'>
      <p>Display Options</p>
      <div className='dropdown-menu'>
        {items.map((item: string) => (
          <label key={item} className='dropdown-item'>
            <input
              type='checkbox'
              checked={selectedItems[item]}
              onChange={() => onToggle(item)}
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
};

export default DropdownSelector;
