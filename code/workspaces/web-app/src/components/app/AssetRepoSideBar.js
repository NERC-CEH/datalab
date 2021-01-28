import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import SideBarGroup from './SideBarGroup';
import SideBarButton from './SideBarButton';
import sideBarStyles from './sideBarStyles';

const AdminSideBar = ({ classes }) => (
  <div className={classes.sideBar}>
    <List className={classes.itemList}>
      <SideBarGroup title='Asset Repo'>
        <SideBarButton to="/assets/add-metadata" label="Add Metadata" icon="dashboard"></SideBarButton>
      </SideBarGroup>
    </List>
  </div>
);

AdminSideBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(sideBarStyles)(AdminSideBar);
