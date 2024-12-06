import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectSavedTasks,
  saveTask,
  deleteTask,
  editTask
} from '../../app/savedTasksSlice';
import { SavedTask } from '../../types/types';
import {
  Container,
  Title,
  DropdownButton,
  ExpandIcon,
  TasksList,
  TaskCard,
  TaskInfo,
  TaskTitle,
  TaskDetails,
  ActionButtons,
  EditButton,
  DeleteButton,
  DeleteIcon
} from '../../styles/components/SavedTasks';
import { Input } from '../../styles/components/Table';

interface SavedTasksProps {
  onTaskSelect: (task: SavedTask) => void;
  disabled: boolean;
}

const SavedTasks: React.FC<SavedTasksProps> = ({ onTaskSelect, disabled }) => {
  const savedTasks: SavedTask[] = useSelector(selectSavedTasks);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<SavedTask | null>(null);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  const handleSaveTask = (task: SavedTask) => {
    const existingTask = savedTasks.find((t) => t.title === task.title);
    if (existingTask) {
      setConflictMessage('Task already exists.');
      setTimeout(() => setConflictMessage(null), 3000);
    } else {
      dispatch(saveTask(task));
    }
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };

  const handleEditTask = (task: SavedTask) => {
    setEditTaskId(task.id);
    setEditedTask(task);
  };

  const handleSaveEditedTask = () => {
    if (editedTask) {
      dispatch(editTask(editedTask));
      setEditTaskId(null);
      setEditedTask(null);
    }
  };

  return (
    <Container style={{ display: disabled ? 'none' : 'block' }}>
      <Title>Saved Tasks:</Title>
      {conflictMessage && <div>{conflictMessage}</div>}
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide Tasks' : 'Show Tasks'}
        <ExpandIcon isOpen={isOpen}>▼</ExpandIcon>
      </DropdownButton>
      <TasksList isOpen={isOpen}>
        {savedTasks.map((task) => (
          <TaskCard
            key={task.id}
            onClick={() => {
              onTaskSelect(task);
              setIsOpen(false);
            }}
          >
            {editTaskId === task.id ? (
              <>
                <TaskInfo>
                  <Input
                    type='text'
                    value={editedTask?.title || ''}
                    onChange={(e) =>
                      setEditedTask({ ...task, title: e.target.value })
                    }
                  />
                  <Input
                    type='number'
                    value={editedTask?.hourlyRate || 0}
                    onChange={(e) =>
                      setEditedTask({
                        ...task,
                        hourlyRate: Number(e.target.value)
                      })
                    }
                  />
                  <Input
                    type='number'
                    value={editedTask?.taxRate || 0}
                    onChange={(e) =>
                      setEditedTask({
                        ...task,
                        taxRate: Number(e.target.value)
                      })
                    }
                  />
                </TaskInfo>
                <ActionButtons>
                  <EditButton onClick={handleSaveEditedTask}>Save</EditButton>
                  <EditButton
                    onClick={() => {
                      setEditedTask(null);
                      setEditTaskId(null);
                    }}
                  >
                    Cancel
                  </EditButton>
                </ActionButtons>
              </>
            ) : (
              <>
                <TaskInfo>
                  <TaskTitle>{task.title}</TaskTitle>
                  <TaskDetails>
                    Rate: {task.hourlyRate} - Tax: {task.taxRate}%
                  </TaskDetails>
                </TaskInfo>
                <ActionButtons>
                  <EditButton onClick={() => handleEditTask(task)}>
                    Edit
                  </EditButton>
                  <DeleteButton onClick={() => handleDeleteTask(task.id)}>
                    <DeleteIcon />
                  </DeleteButton>
                </ActionButtons>
              </>
            )}
          </TaskCard>
        ))}
      </TasksList>
    </Container>
  );
};

export default SavedTasks;
