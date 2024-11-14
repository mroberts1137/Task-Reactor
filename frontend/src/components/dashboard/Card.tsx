import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../styles/themes/theme';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onToggleMinimize: (isMinimized: boolean) => void;
}

interface CardContentProps {
  isMinimized: boolean;
}

interface CardContainerProps {
  isMinimized: boolean;
  className?: string;
}

const CardContainer = styled.div<CardContainerProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  height: ${({ isMinimized }) =>
    isMinimized ? 'auto' : '100%'}; // Adjust height when minimized
  width: 100%;
  overflow: hidden;
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
  display: ${({ isMinimized }) => (isMinimized ? 'none' : 'flex')};
  justify-content: center;
  align-items: center;
`;

const MinimizeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: ${(props) => props.theme.colors.primary};
  z-index: 1;
  &:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

const Card: React.FC<CardProps> = ({
  title,
  children,
  className,
  onToggleMinimize
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimizeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag from starting
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    onToggleMinimize(isMinimized);
  }, [isMinimized, onToggleMinimize]);

  return (
    <CardContainer className={className} isMinimized={isMinimized}>
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
