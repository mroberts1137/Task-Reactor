import React, {
  useState,
  useContext,
  FormEvent,
  ChangeEvent,
  useEffect
} from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../../app/tasksSlice';
import { UserContext } from '../../contexts/context';
import { AppDispatch } from '../../app/store';
import { Task } from '../../types/types';

const calculateEndTime = (
  startTime: Date,
  duration: { hours: number; minutes: number }
): Date => {
  const endTime = new Date(startTime.getTime());
  endTime.setHours(endTime.getHours() + duration.hours);
  endTime.setMinutes(endTime.getMinutes() + duration.minutes);
  return endTime;
};

const calculateDuration = (
  startTime: Date,
  endTime: Date
): { hours: number; minutes: number } => {
  const diff = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
};

const calculateIncome = (
  duration: { hours: number; minutes: number },
  hourlyRate: number,
  taxRate: number
): { grossIncome: number; netIncome: number } => {
  const totalDurationMinutes = duration.hours * 60 + duration.minutes;
  const grossIncome = hourlyRate * (totalDurationMinutes / 60);
  const netIncome = grossIncome * (1 - taxRate / 100);
  return { grossIncome, netIncome };
};

const AddTask: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, user_id } = useContext(UserContext);
  const [title, setTitle] = useState<string>('');
  const [netIncome, setNetIncome] = useState<number>(0);
  const [grossIncome, setGrossIncome] = useState<number>(0);
  const [duration, setDuration] = useState<{ hours: number; minutes: number }>({
    hours: 0,
    minutes: 0
  });
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);

  // Update grossIncome and netIncome when hourlyRate, duration, or taxRate change
  useEffect(() => {
    const { grossIncome, netIncome } = calculateIncome(
      duration,
      hourlyRate,
      taxRate
    );
    setGrossIncome(grossIncome);
    setNetIncome(netIncome);
  }, [hourlyRate, duration, taxRate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!user_id || !user) {
      console.log('No user logged in');
      return;
    }

    const newTask: Task = {
      title: title || 'New Task',
      netIncome: parseFloat(netIncome.toString()) || 0,
      grossIncome: parseFloat(grossIncome.toString()) || 0,
      duration: duration.hours * 60 + duration.minutes,
      startTime: startTime || new Date(),
      endTime: endTime || new Date(),
      hourlyRate: parseFloat(hourlyRate.toString()) || 0,
      taxRate: parseFloat(taxRate.toString()) || 0
    };

    dispatch(addTask({ user_id, item: newTask }));

    // Reset form
    setTitle('');
    setNetIncome(0);
    setGrossIncome(0);
    setDuration({ hours: 0, minutes: 0 });
    setStartTime(new Date());
    setEndTime(new Date());
    setHourlyRate(0);
    setTaxRate(0);
  };

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartTime = new Date(e.target.value);
    setStartTime(newStartTime);
    setEndTime(calculateEndTime(newStartTime, duration));
  };

  const handleDurationChange = (hours: number, minutes: number) => {
    setDuration({ hours, minutes });
    setEndTime(calculateEndTime(startTime, { hours, minutes }));
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newEndTime = new Date(e.target.value);
    // Ensure that the endTime is never before the startTime
    if (newEndTime.getTime() < startTime.getTime()) {
      newEndTime = startTime;
    }
    setEndTime(newEndTime);
    setDuration(calculateDuration(startTime, newEndTime));
  };

  const handleHourlyRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHourlyRate(parseFloat(e.target.value));
  };

  const handleTaxRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaxRate(parseFloat(e.target.value));
  };

  return (
    <div className='input-container'>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>Task</td>
              <td>
                <input
                  type='text'
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTitle(e.target.value)
                  }
                  value={title}
                  name='title'
                  className='long-input'
                />
              </td>
            </tr>
            <tr>
              <td>Duration (Hours)</td>
              <td>
                <input
                  type='number'
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleDurationChange(
                      parseInt(e.target.value),
                      duration.minutes
                    )
                  }
                  value={duration.hours}
                  name='durationHours'
                  className='short-input'
                />
              </td>
            </tr>
            <tr>
              <td>Duration (Minutes)</td>
              <td>
                <input
                  type='number'
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleDurationChange(
                      duration.hours,
                      parseInt(e.target.value)
                    )
                  }
                  value={duration.minutes}
                  name='durationMinutes'
                  className='short-input'
                />
              </td>
            </tr>
            <tr>
              <td>Rate</td>
              <td>
                <input
                  type='number'
                  onChange={handleHourlyRateChange}
                  value={hourlyRate}
                  name='rate'
                  className='short-input'
                />
              </td>
            </tr>
            <tr>
              <td>Tax Rate (%)</td>
              <td>
                <input
                  type='number'
                  onChange={handleTaxRateChange}
                  value={taxRate}
                  name='taxRate'
                  className='short-input'
                />
              </td>
            </tr>
            <tr>
              <td>Start Time</td>
              <td>
                <input
                  type='datetime-local'
                  onChange={handleStartTimeChange}
                  value={startTime.toISOString().slice(0, -1).slice(0, 16)}
                  name='startTime'
                  className='long-input'
                />
              </td>
            </tr>
            <tr>
              <td>End Time</td>
              <td>
                <input
                  type='datetime-local'
                  onChange={handleEndTimeChange}
                  value={endTime.toISOString().slice(0, -1).slice(0, 16)}
                  name='endTime'
                  className='long-input'
                />
              </td>
            </tr>
            <tr>
              <td>Gross Income</td>
              <td>
                <input
                  type='number'
                  value={grossIncome}
                  readOnly
                  name='grossIncome'
                  className='short-input'
                />
              </td>
            </tr>
            <tr>
              <td>Net Income</td>
              <td>
                <input
                  type='number'
                  readOnly
                  value={netIncome}
                  name='value'
                  className='short-input'
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button className='add-item-btn' type='submit'>
          +
        </button>
      </form>
    </div>
  );
};

export default AddTask;
