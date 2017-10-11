import React from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import datalabsLogo from '../../../assets/images/datalabs-hori.png';
import NavLink from './NavLink';

const drawerWidth = 240;

const styles = theme => ({
  header: {
    ...theme.mixins.toolbar,
    padding: 16,
    backgroundColor: theme.palette.secondary[900],
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
    backgroundColor: theme.palette.secondary[800],
    borderWidth: 0,
  },
  logo: {
    width: 140,
  },
});

const SideBar = ({ classes }) => (
  <Drawer classes={{ paper: classes.drawerPaper }} type="permanent">
    <header className={classes.header}>
      <img className={classes.logo} src={datalabsLogo} alt="datalabs-logo" />
    </header>
    <List>
      <NavLink to="/" label="Dashboard" icon="dashboard" />
      <ListSubheader>Data</ListSubheader>
      <NavLink to="/storage" label="Storage" icon="storage" />
      <ListSubheader>Analysis</ListSubheader>
      <NavLink to="/notebooks" label="Notebooks" icon="book" />
    </List>
  </Drawer>
);

export default withStyles(styles)(SideBar);
