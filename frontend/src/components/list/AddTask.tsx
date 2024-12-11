import React, {
  useState,
  useContext,
  FormEvent,
  ChangeEvent,
  useEffect
} from 'react';
import { useDispatch } from 'react-redux';
import { UserContext } from '../../contexts/context';
import { AppDispatch } from '../../app/store';
import { isValidTask, Task } from '../../types/types';
import { addTask } from '../../app/tasksThunks';
import { Table } from 'reactstrap';
import { AddButton, Input } from '../../styles/components/Table';
import {
  sanitizeDate,
  sanitizeNumber,
  sanitizeString
} from '../../utils/sanitize-input';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    // Validate and sanitize inputs
    const newErrors: { [key: string]: string } = {};
    const sanitizedTitle = sanitizeString(title);
    const sanitizedHourlyRate = sanitizeNumber(hourlyRate.toString());
    const sanitizedTaxRate = sanitizeNumber(taxRate.toString());
    const sanitizedStartTime = sanitizeDate(startTime.toISOString());
    const sanitizedEndTime = sanitizeDate(endTime.toISOString());

    if (!sanitizedTitle) newErrors.title = 'Title is required';
    if (isNaN(sanitizedHourlyRate))
      newErrors.hourlyRate = 'Invalid hourly rate';
    if (isNaN(sanitizedTaxRate)) newErrors.taxRate = 'Invalid tax rate';
    if (!sanitizedStartTime) newErrors.startTime = 'Invalid start time';
    if (!sanitizedEndTime) newErrors.endTime = 'Invalid end time';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const newTask: Task = {
      id: undefined,
      title: sanitizedTitle,
      netIncome: parseFloat(netIncome.toFixed(2)),
      grossIncome: parseFloat(grossIncome.toFixed(2)),
      duration: (duration.hours * 60 + duration.minutes) * 60 * 1000,
      startTime: sanitizedStartTime,
      endTime: sanitizedEndTime,
      hourlyRate: sanitizedHourlyRate,
      taxRate: sanitizedTaxRate
    };

    if (!isValidTask(newTask)) return;

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

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeString(e.target.value);
    setTitle(sanitizedTitle);
    if (!sanitizedTitle) {
      setErrors((prev) => ({ ...prev, title: 'Title is required' }));
      return;
    }
    setErrors((prev) => ({ ...prev, title: '' }));
  };

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newStartTime = new Date(e.target.value);
    if (isNaN(newStartTime.getTime())) {
      setErrors((prev) => ({ ...prev, startTime: 'Invalid start time' }));
      return;
    }
    setStartTime(newStartTime);
    setEndTime(calculateEndTime(newStartTime, duration));
    setErrors((prev) => ({ ...prev, startTime: '' }));
  };

  const handleDurationChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: 'hours' | 'minutes'
  ) => {
    e.preventDefault();
    const value = sanitizeNumber(e.target.value);
    if (isNaN(value)) {
      setErrors((prev) => ({ ...prev, [type]: `Invalid ${type}` }));
      return;
    }
    const newDuration = {
      ...duration,
      [type]: Math.max(0, Math.floor(value))
    };
    setDuration(newDuration);
    setEndTime(calculateEndTime(startTime, newDuration));
    setErrors((prev) => ({ ...prev, [type]: '' }));
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newEndTime = new Date(e.target.value);
    if (isNaN(newEndTime.getTime())) {
      setErrors((prev) => ({ ...prev, endTime: 'Invalid end time' }));
      return;
    }
    if (newEndTime.getTime() < startTime.getTime()) {
      setErrors((prev) => ({
        ...prev,
        endTime: 'End time must be after start time'
      }));
      return;
    }
    setEndTime(newEndTime);
    setDuration(calculateDuration(startTime, newEndTime));
    setErrors((prev) => ({ ...prev, endTime: '' }));
  };

  const handleHourlyRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = sanitizeNumber(e.target.value);
    if (isNaN(value) || value < 0) {
      setErrors((prev) => ({ ...prev, hourlyRate: 'Invalid hourly rate' }));
      return;
    }
    setHourlyRate(value);
    setErrors((prev) => ({ ...prev, hourlyRate: '' }));
  };

  const handleTaxRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = sanitizeNumber(e.target.value);
    if (isNaN(value) || value < 0 || value > 100) {
      setErrors((prev) => ({ ...prev, taxRate: 'Invalid tax rate (0-100)' }));
      return;
    }
    setTaxRate(value);
    setErrors((prev) => ({ ...prev, taxRate: '' }));
  };

  const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <span style={{ color: 'red', fontSize: '0.8em' }}>{message}</span>
  );

  return (
    <div className='input-container'>
      <form onSubmit={handleSubmit}>
        <Table>
          <tbody>
            <tr>
              <td>Task</td>
              <td>
                <Input
                  type='text'
                  onChange={handleTitleChange}
                  value={title}
                  name='title'
                  className='long-input'
                />
                {errors.title && <ErrorMessage message={errors.title} />}
              </td>
            </tr>
            <tr>
              <td>Duration (Hours)</td>
              <td>
                <Input
                  type='number'
                  onChange={(e) => handleDurationChange(e, 'hours')}
                  value={duration.hours}
                  name='durationHours'
                  className='short-input'
                />
                {errors.duration && <ErrorMessage message={errors.duration} />}
              </td>
            </tr>
            <tr>
              <td>Duration (Minutes)</td>
              <td>
                <Input
                  type='number'
                  onChange={(e) => handleDurationChange(e, 'minutes')}
                  value={duration.minutes}
                  name='durationMinutes'
                  className='short-input'
                />
              </td>
            </tr>
            <tr>
              <td>Rate</td>
              <td>
                <Input
                  type='number'
                  onChange={handleHourlyRateChange}
                  value={hourlyRate}
                  name='rate'
                  className='short-input'
                />
                {errors.hourlyRate && (
                  <ErrorMessage message={errors.hourlyRate} />
                )}
              </td>
            </tr>
            <tr>
              <td>Tax Rate (%)</td>
              <td>
                <Input
                  type='number'
                  onChange={handleTaxRateChange}
                  value={taxRate}
                  name='taxRate'
                  className='short-input'
                />
                {errors.taxRate && <ErrorMessage message={errors.taxRate} />}
              </td>
            </tr>
            <tr>
              <td>Start Time</td>
              <td>
                <Input
                  type='datetime-local'
                  onChange={handleStartTimeChange}
                  value={new Date(
                    startTime.getTime() - startTime.getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, -1)
                    .slice(0, 16)}
                  name='startTime'
                  className='long-input'
                />
                {errors.startTime && (
                  <ErrorMessage message={errors.startTime} />
                )}
              </td>
            </tr>
            <tr>
              <td>End Time</td>
              <td>
                <Input
                  type='datetime-local'
                  onChange={handleEndTimeChange}
                  value={new Date(
                    endTime.getTime() - startTime.getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, -1)
                    .slice(0, 16)}
                  name='endTime'
                  className='long-input'
                />
                {errors.endTime && <ErrorMessage message={errors.endTime} />}
              </td>
            </tr>
            <tr>
              <td>Gross Income</td>
              <td>
                <Input
                  type='number'
                  value={grossIncome.toFixed(2)}
                  readOnly
                  name='grossIncome'
                  className='short-input'
                />
              </td>
            </tr>
            <tr>
              <td>Net Income</td>
              <td>
                <Input
                  type='number'
                  readOnly
                  value={netIncome.toFixed(2)}
                  name='value'
                  className='short-input'
                />
              </td>
            </tr>
          </tbody>
        </Table>
        <AddButton className='add-item-btn' type='submit'>
          +
        </AddButton>
      </form>
    </div>
  );
};

export default AddTask;
