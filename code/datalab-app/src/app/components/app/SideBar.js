import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import datalabsLogo from '../../../assets/images/datalabs-hori.png';
import SideBarSubheader from './SideBarSubheader';
import NavLink from './NavLink';

export const drawerWidth = 240;

const styles = theme => ({
  header: {
    ...theme.mixins.toolbar,
    backgroundColor: theme.palette.secondary[900],
    display: 'flex',
    alignItems: 'center',
  },
  drawerPaper: {
    position: 'fixed',
    height: '100%',
    width: drawerWidth,
    backgroundColor: theme.palette.secondary[800],
    borderWidth: 0,
  },
  logo: {
    width: 140,
    marginLeft: 16,
  },
  drawerList: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  spacer: {
    flex: 1,
  },
});

const SideBar = ({ classes }) => (
  <Drawer classes={{ paper: classes.drawerPaper }} type="permanent">
    <header className={classes.header}>
      <img className={classes.logo} src={datalabsLogo} alt="datalabs-logo" />
    </header>
    <List className={classes.drawerList}>
      <NavLink to="/" label="Dashboard" icon="dashboard" />
      <SideBarSubheader>Data</SideBarSubheader>
      <NavLink to="/storage" label="Storage" icon="storage" />
      <SideBarSubheader>Analysis</SideBarSubheader>
      <NavLink to="/notebooks" label="Notebooks" icon="book" />
      <NavLink to="/dask" label="Dask" icon="apps" />
      <NavLink to="/spark" label="Spark" icon="apps" />
      <SideBarSubheader>Publish</SideBarSubheader>
      <NavLink to="/publishing" label="Sites" icon="web" />
      <div className={classes.spacer} />
      <Divider />
      <NavLink label="Help" icon="help_outline" onClick={() => window.open('https://datalab-docs.datalabs.nerc.ac.uk/')} />
    </List>
  </Drawer>
);

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideBar);
