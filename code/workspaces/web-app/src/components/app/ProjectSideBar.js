import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React from 'react';
import { permissionTypes } from 'common';
import PermissionWrapper from '../common/ComponentPermissionWrapper';
import SideBarGroup from './SideBarGroup';
import SideBarButton from './SideBarButton';
import ProjectSwitcher from './ProjectSwitcher';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import sideBarStyles from './sideBarStyles';

const { projectPermissions: { PROJECT_KEY_STORAGE_LIST, PROJECT_KEY_STACKS_LIST, PROJECT_KEY_SETTINGS_LIST }, projectKeyPermission } = permissionTypes;

const projectRouteBase = projectKey => `/projects/${projectKey}`;

const InfoGroup = ({ projectKey }) => (
  <SideBarGroup key='Info'>
    <ProjectSwitcher />
    <SideBarButton to={`${projectRouteBase(projectKey)}/info`} label="Information" icon="info_outline" />
  </SideBarGroup>
);

const AnalysisGroup = ({ userPermissions, projectKey }) => (
  <SideBarGroup title='Analysis'>
    <PermissionWrapper userPermissions={userPermissions} permission={projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey)}>
      <SideBarButton to={`${projectRouteBase(projectKey)}/notebooks`} label="Notebooks" icon="book" />
    </PermissionWrapper>
    <SideBarButton to={`${projectRouteBase(projectKey)}/dask`} label="Dask" icon="apps" />
    <SideBarButton to={`${projectRouteBase(projectKey)}/spark`} label="Spark" icon="apps" />
  </SideBarGroup>
);

const MiscGroup = ({ userPermissions, projectKey }) => (
  <SideBarGroup>
    <PermissionWrapper userPermissions={userPermissions} permission={projectKeyPermission(PROJECT_KEY_STORAGE_LIST, projectKey)}>
      <SideBarButton to={`${projectRouteBase(projectKey)}/storage`} label="Storage" icon="storage" />
    </PermissionWrapper>
    <PermissionWrapper userPermissions={userPermissions} permission={projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey)}>
      <SideBarButton to={`${projectRouteBase(projectKey)}/publishing`} label="Sites" icon="web" />
    </PermissionWrapper>
    <PermissionWrapper userPermissions={userPermissions} permission={projectKeyPermission(PROJECT_KEY_SETTINGS_LIST, projectKey)}>
      <SideBarButton to={`${projectRouteBase(projectKey)}/settings`} label="Settings" icon="settings" />
    </PermissionWrapper>
  </SideBarGroup>
);

const ProjectSideBar = ({ classes, userPermissions }) => <PureSideBar
  classes={classes}
  userPermissions={userPermissions}
  projectKey={useCurrentProjectKey()}
/>;

export const PureSideBar = ({ classes, userPermissions, projectKey }) => (
  <div className={classes.sideBar}>
    <List className={classes.itemList}>
      <InfoGroup classes={classes} projectKey={projectKey.value} />
      <AnalysisGroup userPermissions={userPermissions} projectKey={projectKey.value} />
      <MiscGroup userPermissions={userPermissions} projectKey={projectKey.value} />
    </List>
  </div>
);

ProjectSideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

PureSideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  projectKey: PropTypes.shape({
    fetching: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    value: PropTypes.string,
  }),
};

export default withStyles(sideBarStyles)(ProjectSideBar);
