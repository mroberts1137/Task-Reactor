import { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Collapse,
  NavbarToggler,
  Nav,
  NavItem
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = () => setMenuOpen(!menuOpen);

  return (
    <Navbar dark sticky='top' expand='md' className='navbar flex-row'>
      <NavbarBrand href='/' className='ms-1 flex-row'>
        <img src={logo} alt='logo' className='float-start nav-logo' />
        <h1 className='mt-1 nav-title'>Task Reactor</h1>
      </NavbarBrand>

      {/* <NavbarToggler onClick={toggle} className='toggler' /> */}

      {/* <Collapse isOpen={menuOpen} navbar> */}
      <Nav className='ms-auto' navbar>
        <NavItem>
          <NavLink className='nav-link' to='/'>
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className='nav-link' to='/register'>
            Register
          </NavLink>
        </NavItem>
      </Nav>
      {/* </Collapse> */}
    </Navbar>
  );
};

export default Header;
