import React from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import datalabsLogo from '../../../assets/images/datalabs-hori.png';
import SideBarSubheader from './SideBarSubheader';
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
      <SideBarSubheader>Data</SideBarSubheader>
      <NavLink to="/storage" label="Storage" icon="storage" />
      <SideBarSubheader>Analysis</SideBarSubheader>
      <NavLink to="/notebooks" label="Notebooks" icon="book" />
      <NavLink label="Dask" icon="apps" onClick={() => window.open('https://datalab-dask.datalabs.nerc.ac.uk/')} />
      <Divider />
      <NavLink label="Help" icon="help_outline" onClick={() => window.open('https://datalab-docs.datalabs.nerc.ac.uk/')} />
    </List>
  </Drawer>
);

export default withStyles(styles)(SideBar);
