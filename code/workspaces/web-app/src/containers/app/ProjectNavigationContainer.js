import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Route, Switch, Redirect, useParams, useRouteMatch } from 'react-router';
import { permissionTypes } from 'common';
import projectActions from '../../actions/projectActions';
import SideBarNavigation from '../../components/app/SideBarNavigation';
import ProjectInfoPage from '../../pages/ProjectInfoPage';
import RoutePermissions from '../../components/common/RoutePermissionWrapper';
import DataStoragePage from '../../pages/DataStoragePage';
import NotFoundPage from '../../pages/NotFoundPage';
import NotebooksPage from '../../pages/NotebooksPage';
import PublishingPage from '../../pages/PublishingPage';
import SettingsPage from '../../pages/SettingsPage';
import DaskPage from '../../pages/DaskPage';
import SparkPage from '../../pages/SparkPage';
import ProjectSideBar from '../../components/app/ProjectSideBar';
import { useCurrentUserPermissions } from '../../hooks/authHooks';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';

const {
  projectKeyPermission,
  projectPermissions: { PROJECT_KEY_PROJECTS_READ, PROJECT_KEY_STORAGE_LIST, PROJECT_KEY_STACKS_LIST, PROJECT_KEY_SETTINGS_LIST },
  SYSTEM_INSTANCE_ADMIN,
} = permissionTypes;

function ProjectNavigationContainer() {
  const { projectKey } = useParams();
  const { path } = useRouteMatch();
  const dispatch = useDispatch();
  const promisedUserPermissions = useCurrentUserPermissions();

  useEffect(() => {
    dispatch(projectActions.setCurrentProject(projectKey));
  }, [dispatch, projectKey]);

  return <PureProjectNavigationContainer
    path={path}
    promisedUserPermissions={promisedUserPermissions}
    projectKey={useCurrentProjectKey()}
    dispatch={dispatch}
  />;
}

function PureProjectNavigationContainer({ path, promisedUserPermissions, projectKey, dispatch }) {
  if (shouldRedirectToProjectsPage(projectKey, promisedUserPermissions)) {
    dispatch(projectActions.clearCurrentProject());
    return <Redirect to="/projects" />;
  }

  const redirectPath = projectKey.value
    ? `${path.replace(':projectKey', projectKey.value)}/info`
    : undefined;

  return (
    <SideBarNavigation sideBar={
      <ProjectSideBar userPermissions={promisedUserPermissions.value} />
    }>
      <Switch>
        <Route exact path={`${path}/info`}>
          <ProjectInfoPage />
        </Route>
        <RoutePermissions
          exact
          path={`${path}/storage`}
          component={DataStoragePage}
          permission={projectKeyPermission(PROJECT_KEY_STORAGE_LIST, projectKey.value)}
          redirectTo={redirectPath} />
        <RoutePermissions
          exact
          path={`${path}/notebooks`}
          component={NotebooksPage}
          permission={projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey.value)}
          redirectTo={redirectPath} />
        <RoutePermissions
          exact
          path={`${path}/publishing`}
          component={PublishingPage}
          permission={projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey.value)}
          redirectTo={redirectPath} />
        <RoutePermissions
          exact
          path={`${path}/settings`}
          component={SettingsPage}
          permission={projectKeyPermission(PROJECT_KEY_SETTINGS_LIST, projectKey.value)}
          redirectTo={redirectPath} />
        <Route exact path={`${path}/dask`}>
          <DaskPage />
        </Route>
        <Route exact path={`${path}/spark`}>
          <SparkPage />
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </SideBarNavigation>
  );
}

PureProjectNavigationContainer.propTypes = {
  projectKey: PropTypes.shape({
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.string,
    error: PropTypes.any,
  }),
};

const shouldRedirectToProjectsPage = (projectKey, promisedUserPermissions) => projectKey.error
  || doesNotHaveProjectPermission(promisedUserPermissions, projectKey);

const doesNotHaveProjectPermission = (promisedUserPermissions, projectKey) => !projectKey.fetching
  && projectKey.value
  && !promisedUserPermissions.fetching
  && !promisedUserPermissions.value.includes(projectKeyPermission(PROJECT_KEY_PROJECTS_READ, projectKey.value))
  && !promisedUserPermissions.value.includes(SYSTEM_INSTANCE_ADMIN);

export { PureProjectNavigationContainer };

export default ProjectNavigationContainer;
