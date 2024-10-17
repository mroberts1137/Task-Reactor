import { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Collapse,
  NavbarToggler,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../assets/logo.png';
import './Header.css';
import { logout } from '../app/userSlice';
import { clearTasks } from '../app/tasksSlice';
import { clearDailyGoals } from '../app/dailyGoalsSlice';
import { clearMonthlyGoals } from '../app/monthlyGoalsSlice';
import { AppDispatch, RootState } from '../app/store';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = () => setMenuOpen(!menuOpen);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = () => {
    // Clear user data from Redux store
    dispatch(logout());
    dispatch(clearTasks());
    dispatch(clearDailyGoals());
    dispatch(clearMonthlyGoals());

    // Redirect to home page
    navigate('/');
  };

  return (
    <Navbar dark sticky='top' expand='md' className='navbar flex-row'>
      <NavbarBrand href='/' className='ms-1 flex-row'>
        <img src={logo} alt='logo' className='float-start nav-logo' />
        <h1 className='mt-1 nav-title'>Task Reactor</h1>
      </NavbarBrand>

      <NavbarToggler onClick={toggle} className='toggler' />

      <Collapse isOpen={menuOpen} navbar>
        {!user && (
          <Nav className='ms-auto nav-menu align-items-center' navbar>
            <NavItem>
              <NavLink className='nav-link' to='/'>
                Home
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink className='nav-link' to='/Login'>
                Login
              </NavLink>
            </NavItem>
          </Nav>
        )}

        {user && (
          <Nav className='ms-auto nav-menu align-items-center' navbar>
            <NavItem>
              <NavLink className='nav-link' to='/Dashboard'>
                Dashboard
              </NavLink>
            </NavItem>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {user.username}
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownItem>
                <DropdownItem onClick={() => navigate('/settings')}>
                  Settings
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        )}
      </Collapse>
    </Navbar>
  );
};

export default Header;
