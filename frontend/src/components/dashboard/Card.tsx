import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../themes/theme';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  isMinimized: boolean;
}

interface CardContainerProps {
  className?: string;
}

const CardContainer = styled.div<CardContainerProps>`
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.surface};
  border-radius: ${({ theme }: { theme: Theme }) => theme.borderRadius};
  box-shadow: ${({ theme }: { theme: Theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: ${({ theme }: { theme: Theme }) => theme.transitions.default};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: ${({ theme }: { theme: Theme }) => theme.colors.header};
  border-bottom: 1px solid
    ${({ theme }: { theme: Theme }) => theme.colors.border};
  cursor: move; // Indicates draggable area

  &:hover {
    background-color: ${({ theme }: { theme: Theme }) =>
      theme.colors.table.hover};
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: ${(props) => props.theme.colors.text.primary};
  pointer-events: none;
`;

const CardContent = styled.div<CardContentProps>`
  padding: 15px;
  flex-grow: 1;
  overflow-y: auto;
  ${(props) =>
    props.isMinimized &&
    `
    display: none;
  `}
`;

const MinimizeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: ${(props) => props.theme.colors.primary};
  z-index: 1; // Ensure button is clickable
  pointer-events: auto; // Ensure clicks work
  &:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimizeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag from starting
    setIsMinimized(!isMinimized);
  };

  return (
    <CardContainer className={className}>
      <CardHeader className='draggable-handle'>
        <CardTitle>{title}</CardTitle>
        <MinimizeButton onClick={handleMinimizeClick}>
          {isMinimized ? '+' : '-'}
        </MinimizeButton>
      </CardHeader>
      <CardContent isMinimized={isMinimized}>{children}</CardContent>
    </CardContainer>
  );
};

export default Card;
