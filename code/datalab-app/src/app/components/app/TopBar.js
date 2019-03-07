import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import UserInfo from './UserIcon';

const TopBar = ({ identity }) => (
  <AppBar position="fixed">
    <Toolbar>
      <div style={{ flex: 1 }} />
      <UserInfo identity={identity} />
    </Toolbar>
  </AppBar>
);

TopBar.propTypes = {
  identity: PropTypes.object.isRequired,
};

export default TopBar;
