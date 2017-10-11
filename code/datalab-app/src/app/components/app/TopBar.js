import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import auth from '../../auth/auth';

const TopBar = () => (
  <AppBar position="fixed">
    <Toolbar>
      <div style={{ flex: 1 }} />
      <Button color="primary" raised onClick={auth.logout}>Logout</Button>
    </Toolbar>
  </AppBar>
);

export default TopBar;
