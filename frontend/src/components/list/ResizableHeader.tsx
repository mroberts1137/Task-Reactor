import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

const ResizeHandle = styled.div`
  width: 5px;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  position: absolute;
  right: 0;
  top: 0;
  cursor: col-resize;
  user-select: none;
`;

const HeaderCell = styled.th`
  position: relative;
`;

interface ResizableHeaderProps {
  children: React.ReactNode;
  onResize: (width: number) => void;
}

const ResizableHeader: React.FC<ResizableHeaderProps> = ({
  children,
  onResize
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    setStartX(e.pageX);
    setStartWidth((e.target as HTMLElement).offsetWidth);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const width = startWidth + e.pageX - startX;
        onResize(width);
      }
    },
    [isResizing, onResize, startWidth, startX]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <HeaderCell>
      {children}
      <ResizeHandle onMouseDown={handleMouseDown} />
    </HeaderCell>
  );
};

export default ResizableHeader;
