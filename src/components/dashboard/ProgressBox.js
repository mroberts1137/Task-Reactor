import { useState, useEffect } from 'react';

const Progress = ({ goalsTotal, totalEarnings }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(Math.floor((totalEarnings / goalsTotal) * 10000) / 100);
  }, [goalsTotal, totalEarnings]);

  return (
    <div className='container'>
      <h3>Progress: {progress}%</h3>
      <h3>Goals Total: ${goalsTotal}</h3>
      <h3>Total Earnings: ${totalEarnings}</h3>
      <progress value={progress} max={100} />
    </div>
  );
};

export default Progress;
