import React, { useEffect, useRef, useState } from 'react';
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
import { logout, selectUser } from '../app/userSlice';
import { clearTasks } from '../app/tasksSlice';
import { clearDailyGoals } from '../app/dailyGoalsSlice';
import { clearMonthlyGoals } from '../app/monthlyGoalsSlice';
import { AppDispatch } from '../app/store';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      await dispatch(logout()).unwrap();
      dispatch(clearTasks());
      dispatch(clearDailyGoals());
      dispatch(clearMonthlyGoals());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle logout error (e.g., show a notification)
    }
  };

  const handleDropdownNavigationClick = (path: string) => {
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <NavbarContainer>
      <NavbarBrand>
        <Logo src={logo} alt='logo' />
        <Title>Task Reactor</Title>
        <p style={{ marginLeft: 5, marginBottom: -12, fontSize: 16 }}>
          v{process.env.REACT_APP_VERSION}
          {process.env.NODE_ENV === 'production' ? '' : ' dev'}
        </p>
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

            <DropdownContainer ref={dropdownRef}>
              <DropdownToggle onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.username}
              </DropdownToggle>
              <DropdownMenu isOpen={dropdownOpen}>
                <DropdownItem
                  onClick={() => handleDropdownNavigationClick('/profile')}
                >
                  Profile
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleDropdownNavigationClick('/settings')}
                >
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
