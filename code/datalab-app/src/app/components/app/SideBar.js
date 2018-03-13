import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import datalabsLogo from '../../../assets/images/datalabs-hori.png';
import SideBarSubheader from './SideBarSubheader';
import NavLink from './NavLink';
import { extendSubdomain } from '../../core/getDomainInfo';
import navBarLinks from '../../constants/navBarLinks';
import PermissionWrapper from '../common/ComponentPermissionWrapper';

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
  <Drawer classes={{ paper: classes.drawerPaper }} type="permanent">
    <header className={classes.header}>
      <img className={classes.logo} src={datalabsLogo} alt="datalabs-logo" />
    </header>
    <List className={classes.drawerList}>
      <NavLink to="/" label="Dashboard" icon="dashboard" />
      <PermissionWrapper userPermissions={userPermissions} permission="project:storage:list">
        <SideBarSubheader>Data</SideBarSubheader>
        <NavLink to="/storage" label="Storage" icon="storage" />
      </PermissionWrapper>
      <SideBarSubheader>Analysis</SideBarSubheader>
      <PermissionWrapper userPermissions={userPermissions} permission="project:stacks:list" >
        <NavLink to="/notebooks" label="Notebooks" icon="book" />
      </PermissionWrapper>
      <NavLink to="/dask" label="Dask" icon="apps" />
      <NavLink to="/spark" label="Spark" icon="apps" />
      <PermissionWrapper userPermissions={userPermissions} permission="project:stacks:list" >
        <SideBarSubheader>Publish</SideBarSubheader>
        <NavLink to="/publishing" label="Sites" icon="web" />
      </PermissionWrapper>
      <div className={classes.spacer} />
      <Divider />
      {datalabLinks.map(({ displayName, href, icon }) =>
        <NavLink
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
