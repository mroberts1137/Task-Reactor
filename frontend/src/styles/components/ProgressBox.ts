import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProgressContainer = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
  background-color: lightgray;
  border-radius: 2px;
  border: solid 1px gray;
  overflow: hidden;
`;

export const Progress = styled.div<{ isComplete: Boolean; progress: number }>`
  position: absolute;
  left: 0;
  height: 100%;
  background-color: ${({ isComplete }) =>
    isComplete ? 'rgb(92, 226, 62)' : 'rgb(107, 135, 245)'};
  width: ${({ progress }) => `${Math.min(progress, 100)}%`};
`;

export const GoalLine = styled.div<{
  offset: number;
  width: number;
  isExceeded: Boolean;
  isComplete: Boolean;
}>`
  position: absolute;
  height: 100%;
  border-right: 1px solid black;
  border-left: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  left: ${({ offset }) => `${offset}%`};
  width: ${({ width }) => `${width}%`};
  background-color: ${({ isExceeded, isComplete }) =>
    isExceeded
      ? 'rgba(0, 0, 0, 0.2)'
      : isComplete
      ? 'rgb(92, 226, 62)'
      : 'transparent'};

  & > span {
    font-weight: bold;
    font-size: 0.6rem;
  }
`;

export const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-inline: 1.5rem;

  & > h4 {
    text-align: center;
  }
`;
