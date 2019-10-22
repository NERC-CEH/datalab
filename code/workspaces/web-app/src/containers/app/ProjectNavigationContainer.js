import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { permissionTypes } from 'common';
import useCurrentProjectKey from '../../hooks/useCurrentProjectKey';
import projectActions from '../../actions/projectActions';
import ProjectNavigation from '../../components/app/ProjectNavigation';
import ProjectInfoPage from '../../pages/ProjectInfoPage';
import RoutePermissions from '../../components/common/RoutePermissionWrapper';
import DataStoragePage from '../../pages/DataStoragePage';
import NotFoundPage from '../../pages/NotFoundPage';
import NotebooksPage from '../../pages/NotebooksPage';
import PublishingPage from '../../pages/PublishingPage';
import SettingsPage from '../../pages/SettingsPage';
import DaskPage from '../../pages/DaskPage';
import SparkPage from '../../pages/SparkPage';

const {
  projectKeyPermission,
  projectPermissions: { PROJECT_KEY_PROJECTS_READ, PROJECT_KEY_STORAGE_LIST, PROJECT_KEY_STACKS_LIST, PROJECT_KEY_SETTINGS_LIST },
  SYSTEM_INSTANCE_ADMIN,
} = permissionTypes;

function ProjectNavigationContainer({ match, promisedUserPermissions }) {
  const { params: { projectKey } } = match;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(projectActions.setCurrentProject(projectKey));
  }, [dispatch, projectKey]);

  return <PureProjectNavigationContainer
    match={match}
    promisedUserPermissions={promisedUserPermissions}
    projectKey={useCurrentProjectKey()}
    dispatch={dispatch}
  />;
}

function PureProjectNavigationContainer({ match, promisedUserPermissions, projectKey, dispatch }) {
  const { path } = match;

  if (shouldRedirectToProjectsPage(projectKey, promisedUserPermissions)) {
    dispatch(projectActions.clearCurrentProject());
    return <Redirect to="/projects" />;
  }

  const redirectPath = projectKey.value
    ? `${path.replace(':projectKey', projectKey.value)}/info`
    : undefined;

  return (
    <ProjectNavigation userPermissions={promisedUserPermissions.value}>
      <Switch>
        <Route
          exact
          path={`${path}/info`}
          component={ProjectInfoPage} />
        <RoutePermissions
          exact
          path={`${path}/storage`}
          component={DataStoragePage}
          promisedUserPermissions={promisedUserPermissions}
          permission={projectKeyPermission(PROJECT_KEY_STORAGE_LIST, projectKey.value)}
          redirectTo={redirectPath} />
        <RoutePermissions
          exact
          path={`${path}/notebooks`}
          component={NotebooksPage}
          promisedUserPermissions={promisedUserPermissions}
          permission={projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey.value)}
          redirectTo={redirectPath} />
        <RoutePermissions
          exact
          path={`${path}/publishing`}
          component={PublishingPage}
          promisedUserPermissions={promisedUserPermissions}
          permission={projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey.value)}
          redirectTo={redirectPath} />
        <RoutePermissions
          exact
          path={`${path}/settings`}
          component={SettingsPage}
          promisedUserPermissions={promisedUserPermissions}
          permission={projectKeyPermission(PROJECT_KEY_SETTINGS_LIST, projectKey.value)}
          redirectTo={redirectPath} />
        <Route exact path={`${path}/dask`} component={DaskPage} />
        <Route exact path={`${path}/spark`} component={SparkPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </ProjectNavigation>
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
