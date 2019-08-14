import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import { permissionTypes } from 'common';
import { extendSubdomain } from '../../core/getDomainInfo';
import datalabsLogo from '../../assets/images/datalabs-hori.png';
import navBarLinks from '../../constants/navBarLinks';
import NavLink from './NavLink';
import PermissionWrapper from '../common/ComponentPermissionWrapper';
import SideBarSubheader from './SideBarSubheader';

const { projectPermissions: { PROJECT_STORAGE_LIST, PROJECT_STACKS_LIST } } = permissionTypes;

const { DISCOURSE, SLACK } = navBarLinks;
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

const datalabLinks = [
  { ...DISCOURSE, icon: 'question_answer' },
  { ...SLACK, icon: 'message' },
  { displayName: 'Help', href: extendSubdomain('docs'), icon: 'help_outline' },
];

const SideBar = ({ classes, userPermissions }) => (
  <Drawer classes={{ paper: classes.drawerPaper }} variant="permanent">
    <header className={classes.header}>
      <img className={classes.logo} src={datalabsLogo} alt="datalabs-logo" />
    </header>
    <List className={classes.drawerList}>
      <NavLink to="/" label="Dashboard" icon="dashboard" />
      <PermissionWrapper userPermissions={userPermissions} permission={PROJECT_STORAGE_LIST}>
        <SideBarSubheader>Data</SideBarSubheader>
        <NavLink to="/storage" label="Storage" icon="storage" />
      </PermissionWrapper>
      <SideBarSubheader>Analysis</SideBarSubheader>
      <PermissionWrapper userPermissions={userPermissions} permission={PROJECT_STACKS_LIST}>
        <NavLink to="/notebooks" label="Notebooks" icon="book" />
      </PermissionWrapper>
      <NavLink to="/dask" label="Dask" icon="apps" />
      <NavLink to="/spark" label="Spark" icon="apps" />
      <PermissionWrapper userPermissions={userPermissions} permission={PROJECT_STACKS_LIST}>
        <SideBarSubheader>Publish</SideBarSubheader>
        <NavLink to="/publishing" label="Sites" icon="web" />
      </PermissionWrapper>
      <div className={classes.spacer} />
      <Divider />
      {datalabLinks.map(({ displayName, href, icon }) => <NavLink
          key={`nav-link-${displayName}`}
          label={displayName}
          icon={icon}
          onClick={() => window.open(href)}
        />)}
    </List>
  </Drawer>
);

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(SideBar);
