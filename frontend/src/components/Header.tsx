import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../assets/logo.png';
import {
  NavbarContainer,
  NavbarBrand,
  Logo,
  Title,
  NavbarToggler,
  NavMenu,
  NavItem,
  NavLink,
  DropdownContainer,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from '../styles/components/Header';
import {
  ToggleButton,
  SunIcon,
  MoonIcon
} from '../styles/components/ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import { logout } from '../app/userSlice';
import { clearTasks } from '../app/tasksSlice';
import { clearDailyGoals } from '../app/dailyGoalsSlice';
import { clearMonthlyGoals } from '../app/monthlyGoalsSlice';
import { AppDispatch, RootState } from '../app/store';

interface HeaderProps {
  isDarkMode: Boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  // const { isDarkMode } = useTheme();
  console.log(isDarkMode);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen) {
        // setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
    dispatch(clearTasks());
    dispatch(clearDailyGoals());
    dispatch(clearMonthlyGoals());
    navigate('/');
  };

  return (
    <NavbarContainer>
      <NavbarBrand>
        <Logo src={logo} alt='logo' />
        <Title>Task Reactor</Title>
      </NavbarBrand>

      <NavbarToggler onClick={() => setMenuOpen(!menuOpen)}>☰</NavbarToggler>

      <NavMenu isOpen={menuOpen}>
        <NavItem>
          <ToggleButton onClick={toggleTheme}>
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </ToggleButton>
        </NavItem>
        {!user ? (
          <>
            <NavItem>
              <NavLink to='/'>Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to='/login'>Login</NavLink>
            </NavItem>
          </>
        ) : (
          <>
            <NavItem>
              <NavLink to='/dashboard'>Dashboard</NavLink>
            </NavItem>
            <DropdownContainer>
              <DropdownToggle onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.username}
              </DropdownToggle>
              <DropdownMenu isOpen={dropdownOpen}>
                <DropdownItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownItem>
                <DropdownItem onClick={() => navigate('/settings')}>
                  Settings
                </DropdownItem>
                <DropdownItem className='divider' />
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </DropdownContainer>
          </>
        )}
      </NavMenu>
    </NavbarContainer>
  );
};

export default Header;
