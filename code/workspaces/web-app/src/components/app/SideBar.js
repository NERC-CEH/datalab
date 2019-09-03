import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import { permissionTypes } from 'common';
import PermissionWrapper from '../common/ComponentPermissionWrapper';
import SideBarGroup from './SideBarGroup';
import SideBarButton from './SideBarButton';

const { projectPermissions: { PROJECT_STORAGE_LIST, PROJECT_STACKS_LIST, PROJECT_SETTINGS_LIST } } = permissionTypes;

export const drawerWidth = 200;

const styles = theme => ({
  itemList: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  },
  sideBar: {
    background: theme.palette.sideBarBackground,
    height: '100%',
    width: drawerWidth,
    minWidth: drawerWidth,
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: 'auto',
    padding: `0 ${theme.spacing(2)}px`,
  },
});

const SideBar = ({ classes, userPermissions }) => (
  <div className={classes.sideBar}>
    <List className={classes.itemList}>
      <SideBarGroup>
        <SideBarButton to="/" label="Dashboard" icon="dashboard" />
      </SideBarGroup>

      <SideBarGroup title='Analysis'>
        <PermissionWrapper userPermissions={userPermissions} permission={PROJECT_STACKS_LIST}>
          <SideBarButton to="/notebooks" label="Notebooks" icon="book" />
        </PermissionWrapper>
        <SideBarButton to="/dask" label="Dask" icon="apps" />
        <SideBarButton to="/spark" label="Spark" icon="apps" />
      </SideBarGroup>

      <SideBarGroup>
        <PermissionWrapper userPermissions={userPermissions} permission={PROJECT_STORAGE_LIST}>
          <SideBarButton to="/storage" label="Storage" icon="storage" />
        </PermissionWrapper>
        <PermissionWrapper userPermissions={userPermissions} permission={PROJECT_STACKS_LIST}>
          <SideBarButton to="/publishing" label="Sites" icon="web" />
        </PermissionWrapper>
        <PermissionWrapper userPermissions={userPermissions} permission={PROJECT_SETTINGS_LIST}>
          <SideBarButton to="/settings" label="Settings" icon="settings"/>
        </PermissionWrapper>
      </SideBarGroup>
    </List>
  </div>
);

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(SideBar);
