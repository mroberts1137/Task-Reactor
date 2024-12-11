import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SavedTasks from '../../../components/timerbox/SavedTasks';
import { deleteTask } from '../../../app/savedTasksSlice';

const mockStore = configureStore([]);

describe('SavedTasks', () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', hourlyRate: 20, taxRate: 10 },
    { id: '2', title: 'Task 2', hourlyRate: 25, taxRate: 15 }
  ];

  const mockOnTaskSelect = jest.fn();
  const mockOnEditTask = jest.fn();

  let store;

  beforeEach(() => {
    store = mockStore({
      savedTasks: mockTasks
    });
    store.dispatch = jest.fn();
  });

  it('toggles dropdown visibility when button is clicked', () => {
    render(
      <Provider store={store}>
        <SavedTasks
          onTaskSelect={mockOnTaskSelect}
          onEditTask={mockOnEditTask}
          disabled={false}
        />
      </Provider>
    );

    const dropdownButton = screen.getByText('Show Tasks');
    expect(screen.queryByText('Task 1')).not.toBeVisible();

    fireEvent.click(dropdownButton);
    expect(screen.getByText('Task 1')).toBeVisible();
    expect(dropdownButton).toHaveTextContent('Hide Tasks');

    fireEvent.click(dropdownButton);
    expect(screen.queryByText('Task 1')).not.toBeVisible();
  });

  it('allows editing task without closing menu', () => {
    render(
      <Provider store={store}>
        <SavedTasks
          onTaskSelect={mockOnTaskSelect}
          onEditTask={mockOnEditTask}
          disabled={false}
        />
      </Provider>
    );

    fireEvent.click(screen.getByText('Show Tasks'));

    const editButton = screen.getAllByText('Edit')[0];
    fireEvent.click(editButton);

    expect(screen.getByDisplayValue('Task 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
  });

  it('saves edited task correctly', () => {
    mockOnEditTask.mockReturnValue(true);

    render(
      <Provider store={store}>
        <SavedTasks
          onTaskSelect={mockOnTaskSelect}
          onEditTask={mockOnEditTask}
          disabled={false}
        />
      </Provider>
    );

    fireEvent.click(screen.getByText('Show Tasks'));
    fireEvent.click(screen.getAllByText('Edit')[0]);

    const titleInput = screen.getByDisplayValue('Task 1');
    fireEvent.change(titleInput, { target: { value: 'Updated Task 1' } });

    fireEvent.click(screen.getByText('Save'));

    expect(mockOnEditTask).toHaveBeenCalledWith({
      id: '1',
      title: 'Updated Task 1',
      hourlyRate: 20,
      taxRate: 10
    });
  });

  it('deletes task when delete button is clicked', () => {
    render(
      <Provider store={store}>
        <SavedTasks
          onTaskSelect={mockOnTaskSelect}
          onEditTask={mockOnEditTask}
          disabled={false}
        />
      </Provider>
    );

    fireEvent.click(screen.getByText('Show Tasks'));
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(store.dispatch).toHaveBeenCalledWith(deleteTask('1'));
  });
});
