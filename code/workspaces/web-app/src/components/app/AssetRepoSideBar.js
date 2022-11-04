import withStyles from '@mui/styles/withStyles';
import List from '@mui/material/List';
import PropTypes from 'prop-types';
import React from 'react';
import { permissionTypes } from 'common';
import SideBarGroup from './SideBarGroup';
import SideBarButton from './SideBarButton';
import sideBarStyles from './sideBarStyles';
import { CurrentUserPermissionWrapper } from '../common/ComponentPermissionWrapper';

const { SYSTEM_DATA_MANAGER } = permissionTypes;

const AssetRepoSideBar = ({ classes }) => (
  <div className={classes.sideBar}>
    <List className={classes.itemList}>
      <SideBarGroup title='Asset Repo'>
        <CurrentUserPermissionWrapper permission={SYSTEM_DATA_MANAGER}>
          <SideBarButton to="/assets/add-metadata" label="Add Metadata" icon="dashboard"/>
        </CurrentUserPermissionWrapper>
        <SideBarButton to="/assets/find" label="Find Asset" icon="dashboard"/>
      </SideBarGroup>
    </List>
  </div>
);

AssetRepoSideBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(sideBarStyles)(AssetRepoSideBar);
