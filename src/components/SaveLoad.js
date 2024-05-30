import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import { setGoals } from '../app/goalsReducer';
import { setTasks } from '../app/taskReducer';

const SaveLoad = () => {
  const dispatch = useDispatch();
  const goals = useSelector((state) => state.goals);
  const tasks = useSelector((state) => state.tasks);
  const [file, setFile] = useState(null);

  const handleSave = () => {
    const state = { goals, tasks };
    const blob = new Blob([JSON.stringify(state)], {
      type: 'application/json'
    });
    saveAs(blob, 'state.json');
  };

  // const handleSave = () => {
  //   const goalsBlob = new Blob([JSON.stringify(goals)], { type: 'application/json' });
  //   saveAs(goalsBlob, 'goals.json');

  //   const tasksBlob = new Blob([JSON.stringify(tasks)], { type: 'application/json' });
  //   saveAs(tasksBlob, 'tasks.json');
  // };

  const handleLoad = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleFileRead = (event) => {
    const content = event.target.result;
    const state = JSON.parse(content);
    dispatch(setGoals(state.goals));
    dispatch(setTasks(state.tasks));
  };

  useEffect(() => {
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = handleFileRead;
      reader.readAsText(file);
    }
  }, [file]);

  // const handleFileRead = (event) => {
  //   const content = event.target.result;
  //   const state = JSON.parse(content);
  //   if (file.name === 'goals.json') {
  //     dispatch(setGoals(state));
  //   } else if (file.name === 'tasks.json') {
  //     dispatch(setTasks(state));
  //   }
  // };

  return (
    <div>
      <button onClick={handleSave}>Save State</button>
      <input type='file' onChange={handleLoad} />
    </div>
  );
};

export default SaveLoad;
