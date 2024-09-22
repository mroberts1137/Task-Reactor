import React, { useState } from 'react';

const TaskManager = ({ children }) => {
  const [task, setTask] = useState('');
  const [rate, setRate] = useState('');

  return <div>{children(task, setTask, rate, setRate)}</div>;
};

export default TaskManager;
