import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const SaveLoadButtons = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const saveState = () => {
    const serializedState = JSON.stringify(state);
    const blob = new Blob([serializedState], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'state.json';
    a.click();
  };

  const loadState = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const serializedState = reader.result;
      const state = JSON.parse(serializedState);
      dispatch({ type: 'LOAD_STATE', payload: state });
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <button onClick={saveState}>Save State</button>
      <input type='file' onChange={loadState} />
    </div>
  );
};

export default SaveLoadButtons;
