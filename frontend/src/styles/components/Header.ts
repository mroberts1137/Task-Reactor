import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';

export const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  box-shadow: 0 1px 3px -2px black;
  background: ${({ theme }) => theme.colors.header};
  height: 6rem;
  color: ${({ theme }) => theme.colors.text.primary};
  // position: sticky;
  top: 0;
  z-index: 1000;
`;

export const NavbarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Logo = styled.img`
  width: 4rem;
  height: auto;
`;

export const Title = styled.h1`
  font-size: 38px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const NavbarToggler = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const NavMenu = styled.ul<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  list-style: none;
  gap: 50px;
  font-size: 20px;
  font-weight: 500;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 6rem;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.header};
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    padding: 1rem;
  }
`;

export const NavItem = styled.li`
  display: flex;
  align-items: center;
`;

export const NavLink = styled(RouterNavLink)`
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  padding: 0.5rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
`;

export const DropdownToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &::after {
    content: '▼';
    margin-left: 5px;
    font-size: 12px;
  }
`;

export const DropdownMenu = styled.ul<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};
  list-style: none;
  padding: 0.5rem 0;
  border-radius: ${({ theme }) => theme.borderRadius};
  min-width: 150px;
`;

export const DropdownItem = styled.li`
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.table.hover};
  }

  &.divider {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin: 0.25rem 0;
    padding: 0;
  }
`;
