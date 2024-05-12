import { useState, useEffect } from 'react';
import './ProgressBox.css';

const Progress = ({ goalsTotal, totalEarnings }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(Math.floor((totalEarnings / goalsTotal) * 10000) / 100);
  }, [goalsTotal, totalEarnings]);

  return (
    <div className='container'>
      <h3>{progress}%</h3>
      <div
        className='flex-row'
        style={{
          width: '75%',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div className='flex-col info-col'>
          <h4>Total Earnings:</h4>
          <h4>${totalEarnings.toFixed(2)}</h4>
        </div>
        <progress value={progress} max={100} />
        <div className='flex-col info-col'>
          <h4>Goals Total:</h4>
          <h4>${goalsTotal.toFixed(2)}</h4>
        </div>
      </div>
    </div>
  );
};

export default Progress;
