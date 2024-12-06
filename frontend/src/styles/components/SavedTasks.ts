import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';

export const Container = styled.div`
  margin: 20px 0;
`;

export const Title = styled.h3`
  font-size: 1.2em;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.text};
`;

export const DropdownButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

interface ExpandIconProps {
  isOpen: boolean;
}

export const ExpandIcon = styled.span<ExpandIconProps>`
  margin-left: 10px;
  transition: transform 0.3s ease;
  ${({ isOpen }) => isOpen && 'transform: rotate(180deg);'}
`;

interface TaskListProps {
  isOpen: boolean;
}

export const TasksList = styled.div<TaskListProps>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  margin-top: 10px;
`;

export const TaskCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

export const TaskInfo = styled.div`
  flex-grow: 1;
`;

export const TaskTitle = styled.p`
  font-weight: bold;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.colors.text};
`;

export const TaskDetails = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const EditButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;

export const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.danger};
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.dangerDark};
  }
`;

export const DeleteIcon = styled(FaTrash)`
  font-size: 18px;
`;
