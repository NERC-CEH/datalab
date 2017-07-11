import React from 'react';
import PropTypes from 'prop-types';
import SideBar from './SideBar';
import TopBar from './TopBar';

const sidebarStyle = {
  height: '100%',
  position: 'fixed',
  width: 250,
  background: '#1B1C1D',
};

const mainWindowStyle = {
  marginLeft: 250,
};

const topBarStyle = {
  minHeight: '64px',
};

const Navigation = ({ children }) => (
  <div>
    <div style={sidebarStyle}>
      <SideBar topBarStyle={topBarStyle} />
    </div>
    <div style={mainWindowStyle}>
      <TopBar topBarStyle={topBarStyle} />
      {children}
    </div>
  </div>
);

Navigation.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

export default Navigation;
