import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import TaskForm from '../../../components/timerbox/TaskForm';

const mockTask = {
  id: '1',
  title: 'Test Task',
  hourlyRate: 20,
  taxRate: 10
};

const mockSetTaskSelect = jest.fn();
const mockOnSaveTask = jest.fn();

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form inputs', () => {
    render(
      <TaskForm
        selectedTask={mockTask}
        setTaskSelect={mockSetTaskSelect}
        onSaveTask={mockOnSaveTask}
        disabled={false}
      />
    );

    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter hourly rate')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter tax rate')).toBeInTheDocument();
  });

  test('displays error for empty title', () => {
    render(
      <TaskForm
        selectedTask={{ ...mockTask, title: '' }}
        setTaskSelect={mockSetTaskSelect}
        onSaveTask={mockOnSaveTask}
        disabled={false}
      />
    );

    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  test('displays error for invalid hourly rate', () => {
    render(
      <TaskForm
        selectedTask={{ ...mockTask, hourlyRate: -1 }}
        setTaskSelect={mockSetTaskSelect}
        onSaveTask={mockOnSaveTask}
        disabled={false}
      />
    );

    expect(
      screen.getByText('Hourly rate cannot be negative')
    ).toBeInTheDocument();
  });

  test('disables form when disabled prop is true', () => {
    render(
      <TaskForm
        selectedTask={mockTask}
        setTaskSelect={mockSetTaskSelect}
        onSaveTask={mockOnSaveTask}
        disabled={true}
      />
    );

    expect(screen.getByPlaceholderText('Enter task title')).toBeDisabled();
    expect(screen.getByPlaceholderText('Enter hourly rate')).toBeDisabled();
    expect(screen.getByPlaceholderText('Enter tax rate')).toBeDisabled();
    expect(screen.getByText('Save Task')).toBeDisabled();
  });

  test('calls onSaveTask when form is valid and submitted', () => {
    render(
      <TaskForm
        selectedTask={mockTask}
        setTaskSelect={mockSetTaskSelect}
        onSaveTask={mockOnSaveTask}
        disabled={false}
      />
    );

    // fireEvent.submit(screen.getByRole('form'));
    fireEvent.click(screen.getByText('Save Task'));
    expect(mockOnSaveTask).toHaveBeenCalledWith(mockTask);
  });

  test('updates task when input changes', () => {
    render(
      <TaskForm
        selectedTask={mockTask}
        setTaskSelect={mockSetTaskSelect}
        onSaveTask={mockOnSaveTask}
        disabled={false}
      />
    );

    const titleInput = screen.getByPlaceholderText('Enter task title');
    fireEvent.change(titleInput, {
      target: { name: 'title', value: 'New Title' }
    });

    expect(mockSetTaskSelect).toHaveBeenCalledWith({
      ...mockTask,
      title: 'New Title'
    });
  });
});
