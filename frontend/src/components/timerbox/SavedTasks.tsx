import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSavedTasks, deleteTask } from '../../app/savedTasksSlice';
import { SavedTask, Task } from '../../types/types';
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
  DeleteIcon,
  Backdrop,
  EditContainer,
  EditLabel,
  EditRow,
  EditInput
} from '../../styles/components/SavedTasks';
import { Input } from '../../styles/components/Table';

interface SavedTasksProps {
  onTaskSelect: (task: SavedTask) => void;
  onEditTask: (task: Task) => boolean;
  disabled: boolean;
}

const SavedTasks: React.FC<SavedTasksProps> = ({
  onTaskSelect,
  onEditTask,
  disabled
}) => {
  const savedTasks: SavedTask[] = useSelector(selectSavedTasks);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<SavedTask | null>(null);

  const handleEditTask = (task: SavedTask, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTaskId(task.id);
    setEditedTask(task);
  };

  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteTask(id));
  };

  const handleSaveEditedTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editedTask) {
      const success = onEditTask(editedTask);
      if (success) {
        setEditTaskId(null);
        setEditedTask(null);
      }
    }
  };

  return (
    <Container
      className='overflow-visible'
      style={{ display: disabled ? 'none' : 'block' }}
    >
      <Title>Saved Tasks:</Title>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide Tasks' : 'Show Tasks'}
        <ExpandIcon isOpen={isOpen}>▼</ExpandIcon>
      </DropdownButton>
      <Backdrop isOpen={isOpen} onClick={() => setIsOpen(false)} />
      <TasksList isOpen={isOpen}>
        {savedTasks.map((task) => (
          <TaskCard
            key={task.id}
            onClick={() => {
              if (editTaskId !== task.id) {
                onTaskSelect(task);
                setIsOpen(false);
                setEditedTask(null);
                setEditTaskId(null);
              }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <TaskInfo>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskDetails>
                  Rate: ${task.hourlyRate} - Tax: {task.taxRate}%
                </TaskDetails>

                {editTaskId === task.id && (
                  <EditContainer onClick={(e) => e.stopPropagation()}>
                    <EditRow>
                      <EditLabel>Title:</EditLabel>
                      <Input
                        type='text'
                        value={editedTask?.title || ''}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask!,
                            title: e.target.value
                          })
                        }
                      />
                    </EditRow>
                    <EditRow>
                      <EditLabel>Rate ($):</EditLabel>
                      <Input
                        type='number'
                        value={editedTask?.hourlyRate || 0}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask!,
                            hourlyRate: Number(e.target.value)
                          })
                        }
                      />
                    </EditRow>
                    <EditRow>
                      <EditLabel>Tax (%):</EditLabel>
                      <Input
                        type='number'
                        value={editedTask?.taxRate || 0}
                        onChange={(e) =>
                          setEditedTask({
                            ...editedTask!,
                            taxRate: Number(e.target.value)
                          })
                        }
                      />
                    </EditRow>
                    <ActionButtons style={{ marginTop: '10px' }}>
                      <EditButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEditedTask(e);
                        }}
                      >
                        Save
                      </EditButton>
                      <EditButton
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setEditedTask(null);
                          setEditTaskId(null);
                        }}
                      >
                        Cancel
                      </EditButton>
                    </ActionButtons>
                  </EditContainer>
                )}
              </TaskInfo>
            </div>

            <ActionButtons>
              {editTaskId === task.id ? (
                <>
                  <EditButton onClick={handleSaveEditedTask}>Save</EditButton>
                  <EditButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditedTask(null);
                      setEditTaskId(null);
                    }}
                  >
                    Cancel
                  </EditButton>
                </>
              ) : (
                <>
                  <EditButton onClick={(e) => handleEditTask(task, e)}>
                    Edit
                  </EditButton>
                  <DeleteButton onClick={(e) => handleDeleteTask(task.id, e)}>
                    <DeleteIcon />
                  </DeleteButton>
                </>
              )}
            </ActionButtons>
          </TaskCard>
        ))}
      </TasksList>
    </Container>
  );
};

export default SavedTasks;
