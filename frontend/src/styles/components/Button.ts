import styled from 'styled-components';

export const Button = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const DangerButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.danger};

  &:hover {
    background-color: ${({ theme }) => theme.colors.dangerHover};
  }
`;

export const DeleteButton = styled(DangerButton)`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.danger};
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface StartButtonProps {
  clockrunning: boolean;
}

export const StartButton = styled.button<StartButtonProps>`
  width: 10rem;
  height: 1.5rem;
  border: 1px solid black;
  border-radius: 5px;
  margin: 10px;
  color: rgb(0, 0, 0);
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;

  background-color: ${({ clockrunning }) =>
    clockrunning ? 'rgb(239, 22, 22)' : 'rgb(22, 239, 91)'};

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
    color: rgb(62, 62, 62);
    box-shadow: 3px 3px 4px rgba(80, 80, 80, 0.5);
    border: 1px solid rgb(112, 112, 112);
  }
`;
