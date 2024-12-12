import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import savedTasksReducer from '../../../app/savedTasksSlice';
import SavedTasks from '../../../components/timerbox/SavedTasks';
import { RootState } from '../../../app/store';

const makeStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      savedTasks: savedTasksReducer
    },
    preloadedState: initialState
  });
};

describe('SavedTasks', () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', hourlyRate: 20, taxRate: 10 },
    { id: '2', title: 'Task 2', hourlyRate: 25, taxRate: 15 }
  ];

  const mockOnTaskSelect = jest.fn();
  const mockOnEditTask = jest.fn();
  let store: ReturnType<typeof makeStore>;

  beforeEach(() => {
    store = makeStore({
      savedTasks: mockTasks
    });
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
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();

    fireEvent.click(dropdownButton);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(dropdownButton).toHaveTextContent('Hide Tasks');

    fireEvent.click(dropdownButton);
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    expect(dropdownButton).toHaveTextContent('Show Tasks');
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

  it('deletes task when delete button is clicked', async () => {
    render(
      <Provider store={store}>
        <SavedTasks
          onTaskSelect={mockOnTaskSelect}
          onEditTask={mockOnEditTask}
          disabled={false}
        />
      </Provider>
    );

    // Get the initial state
    const initialState = store.getState() as RootState;
    expect(initialState.savedTasks).toHaveLength(2);
    expect(initialState.savedTasks[0].id).toBe('1');

    fireEvent.click(screen.getByText('Show Tasks'));
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    // Click the delete button
    fireEvent.click(deleteButtons[0]);

    // Wait for state to update
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Get the updated state
    const updatedState = store.getState() as RootState;

    // Check if the task has been removed
    expect(updatedState.savedTasks).toHaveLength(1);
    expect(updatedState.savedTasks[0].id).not.toBe('1');
  });
});
