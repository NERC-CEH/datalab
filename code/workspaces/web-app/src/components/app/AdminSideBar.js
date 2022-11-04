import withStyles from '@mui/styles/withStyles';
import List from '@mui/material/List';
import PropTypes from 'prop-types';
import React from 'react';
import SideBarGroup from './SideBarGroup';
import SideBarButton from './SideBarButton';
import sideBarStyles from './sideBarStyles';

const AdminSideBar = ({ classes }) => (
  <div className={classes.sideBar}>
    <List className={classes.itemList}>
      <SideBarGroup title='Administration'>
        <SideBarButton to="/admin/resources" label="Resources" icon="dashboard"></SideBarButton>
        <SideBarButton to="/admin/users" label="Users" icon="people"></SideBarButton>
        <SideBarButton to="/admin/messages" label="Messages" icon="notifications"></SideBarButton>
      </SideBarGroup>
    </List>
  </div>
);

AdminSideBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(sideBarStyles)(AdminSideBar);
