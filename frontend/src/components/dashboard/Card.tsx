import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../styles/themes/theme';
import ErrorBoundary from '../ErrorBoundary';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const CardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden; /* Prevents content overflow */
  transition: ${({ theme }) => theme.transitions.default};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.header};
  border-bottom: 1px solid
    ${({ theme }: { theme: Theme }) => theme.colors.border};
  cursor: move;

  &:hover {
    background-color: ${({ theme }: { theme: Theme }) =>
      theme.colors.table.hover};
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  pointer-events: none;
`;

const CardContent = styled.div`
  padding: 15px;
  flex-grow: 1;
  overflow-y: auto;
`;

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <ErrorBoundary>
      <CardContainer className={className}>
        <CardHeader className='draggable-handle'>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </CardContainer>
    </ErrorBoundary>
  );
};

export default Card;
