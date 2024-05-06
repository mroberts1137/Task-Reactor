import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSpring, animated } from 'react-spring';

const ListItem = ({ item, removeItem }) => {
  const dispatch = useDispatch();
  const [animate, setAnimate] = useState(false);

  const slideIn = useSpring({
    opacity: animate ? 1 : 0,
    transform: animate ? 'translateX(0%)' : 'translateX(100%)',
    config: { duration: 200, mass: 5, friction: 20, tension: 120 }
  });

  useEffect(() => setAnimate(true), []);

  return (
    <animated.div className='list-item' style={slideIn}>
      <button
        className='remove-item-btn'
        onClick={() => dispatch(removeItem(item))}
      >
        X
      </button>
      {/* {Object.entries(item).map((key, value) => {
        return (
          <div>
            <p className='item-text'>{key}</p>
            <p className='item-text'>{value}</p>
          </div>
        );
      })} */}
      <p className='item-text'>{item.title}</p>
      <p className='item-text'>{item.value}</p>
    </animated.div>
  );
};

export default ListItem;
