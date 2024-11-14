import styled from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';

export const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SunIcon = styled(FaSun)``;
export const MoonIcon = styled(FaMoon)``;
