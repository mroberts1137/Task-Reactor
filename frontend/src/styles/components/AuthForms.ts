import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem 0.5rem;
`;

export const FormSection = styled.section`
  width: 100%;
  max-width: 420px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex-grow: 1;
  padding-bottom: 1rem;
`;

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  &:visited {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Input = styled.input`
  font-family: 'Nunito', sans-serif;
  font-size: 22px;
  padding: 0.25rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 0.5rem;
`;

export const Label = styled.label`
  margin-top: 1rem;
`;

export const Button = styled.button`
  font-family: 'Nunito', sans-serif;
  font-size: 22px;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  margin-top: 1rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondary};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const ErrorMessage = styled.p<{ show: boolean }>`
  background-color: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.background};
  font-weight: bold;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  display: ${({ show }) => (show ? 'block' : 'none')};
`;

export const Instructions = styled.p<{ show: boolean }>`
  font-size: 0.75rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 0.25rem;
  position: relative;
  bottom: -10px;
  display: ${({ show }) => (show ? 'block' : 'none')};
`;

export const ValidationIcon = styled.span<{ valid: boolean; hide: boolean }>`
  color: ${({ valid, theme }) =>
    valid ? theme.colors.success : theme.colors.danger};
  margin-left: 0.25rem;
  display: ${({ hide }) => (hide ? 'none' : 'inline')};
`;
