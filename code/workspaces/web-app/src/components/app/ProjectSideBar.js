import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { permissionTypes } from 'common';
import { CurrentUserPermissionWrapper } from '../common/ComponentPermissionWrapper';
import SideBarGroup from './SideBarGroup';
import SideBarButton from './SideBarButton';
import ProjectSwitcher from './ProjectSwitcher';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import { useProjectUsers } from '../../hooks/projectUsersHooks';
import { useCurrentUserId } from '../../hooks/authHooks';
import sideBarStyles from './sideBarStyles';
import projectSettingsActions from '../../actions/projectSettingsActions';

const { projectPermissions: { PROJECT_KEY_STORAGE_LIST, PROJECT_KEY_STACKS_LIST, PROJECT_KEY_SETTINGS_LIST, PROJECT_KEY_CLUSTERS_LIST }, projectKeyPermission } = permissionTypes;

const projectRouteBase = projectKey => `/projects/${projectKey}`;

const InfoGroup = ({ projectKey }) => (
  <SideBarGroup key='Info'>
    <ProjectSwitcher />
    <SideBarButton to={`${projectRouteBase(projectKey)}/info`} label="Information" icon="info_outline" />
  </SideBarGroup>
);

const AnalysisGroup = ({ projectKey }) => (
  <SideBarGroup title='Analysis'>
    <CurrentUserPermissionWrapper permission={projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey)}>
      <SideBarButton to={`${projectRouteBase(projectKey)}/notebooks`} label="Notebooks" icon="book" />
    </CurrentUserPermissionWrapper>
    <CurrentUserPermissionWrapper permission={projectKeyPermission(PROJECT_KEY_CLUSTERS_LIST, projectKey)}>
      <SideBarButton to={`${projectRouteBase(projectKey)}/dask`} label="Dask" icon="apps" />
    </CurrentUserPermissionWrapper>
    <CurrentUserPermissionWrapper permission={projectKeyPermission(PROJECT_KEY_CLUSTERS_LIST, projectKey)}>
      <SideBarButton to={`${projectRouteBase(projectKey)}/spark`} label="Spark" icon="apps" />
    </CurrentUserPermissionWrapper>
  </SideBarGroup>
);

const MiscGroup = ({ projectKey }) => (
  <SideBarGroup>
    <CurrentUserPermissionWrapper permission={projectKeyPermission(PROJECT_KEY_STORAGE_LIST, projectKey)}>
      <SideBarButton to={`${projectRouteBase(projectKey)}/storage`} label="Storage" icon="storage" />
    </CurrentUserPermissionWrapper>
    <CurrentUserPermissionWrapper permission={projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey)}>
      <SideBarButton to={`${projectRouteBase(projectKey)}/publishing`} label="Sites" icon="web" />
    </CurrentUserPermissionWrapper>
    <CurrentUserPermissionWrapper permission={projectKeyPermission(PROJECT_KEY_SETTINGS_LIST, projectKey)}>
      <SideBarButton to={`${projectRouteBase(projectKey)}/settings`} label="Settings" icon="settings" />
    </CurrentUserPermissionWrapper>
  </SideBarGroup>
);

const ProjectSideBar = ({ classes, userPermissions }) => {
  const projectKey = useCurrentProjectKey();
  const currentUserId = useCurrentUserId();
  const users = useProjectUsers();
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (projectKey.value) {
        dispatch(projectSettingsActions.getProjectUserPermissions(projectKey.value));
      }
    },
    [dispatch, projectKey],
  );

  const isLoading = users.fetching.inProgress || users.value.length === 0;
  const isInstanceAdmin = userPermissions.findIndex(p => p === permissionTypes.SYSTEM_INSTANCE_ADMIN) > -1;

  const isViewer = !isInstanceAdmin
                   && (isLoading || (users && users.value && users.value.findIndex(u => u.userId === currentUserId && u.role === 'viewer') > -1));

  return (<div className={classes.sideBar}>
    <List className={classes.itemList}>
      <InfoGroup classes={classes} projectKey={projectKey.value} />
      {!isLoading && !isViewer && <AnalysisGroup projectKey={projectKey.value} />}
      {!isLoading && <MiscGroup projectKey={projectKey.value} />}
    </List>
  </div>);
};

ProjectSideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withStyles(sideBarStyles)(ProjectSideBar);
