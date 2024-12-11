import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';
import { Input } from './Table';

export const Container = styled.div`
  margin: 20px 0;
  position: relative;
  width: 90%;

  /* Add this class to break out of Card's overflow: hidden */
  &.overflow-visible {
    overflow: visible;
  }
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
  isopen: boolean;
}

export const ExpandIcon = styled.span<ExpandIconProps>`
  margin-left: 10px;
  transition: transform 0.3s ease;
  ${({ isopen }) => isopen && 'transform: rotate(180deg);'}
`;

interface TaskListProps {
  isopen: boolean;
}

export const TasksList = styled.div<TaskListProps>`
  display: ${({ isopen }) => (isopen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 5px;
  padding: 10px;

  /* Add scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

// Optional: Add a backdrop when the dropdown is open
export const Backdrop = styled.div<TaskListProps>`
  display: ${({ isopen }) => (isopen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 999;
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
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // transform: translateZ(0);
  // backface-visibility: hidden;
  // will-change: auto; // instead of 'transform' or other specific properties
  // transform: none;
  // font-size: 14px; // or whatever size you want
  // line-height: 1.4;
  // text-rendering: optimizeLegibility;
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

export const EditContainer = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const EditRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
`;

export const EditLabel = styled.span`
  width: 80px;
  margin-right: 10px;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const EditInput = styled(Input)`
  flex: 1;
`;
