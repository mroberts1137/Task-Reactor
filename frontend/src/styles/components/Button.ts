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
