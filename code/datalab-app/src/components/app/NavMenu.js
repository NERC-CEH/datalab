import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom';

const NavMenu = ({ hideMenu }) => (
    <div>
      <MenuItem onTouchTap={hideMenu}><Link to='/'>Home Page</Link></MenuItem>
      <MenuItem onTouchTap={hideMenu}><Link to='/example'>Example Page</Link></MenuItem>
    </div>
);

NavMenu.propTypes = {
  hideMenu: PropTypes.func.isRequired,
};

export default NavMenu;
