import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { permissionTypes } from 'common';
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

const { projectKeyPermission, projectPermissions: { PROJECT_KEY_STORAGE_LIST, PROJECT_KEY_STACKS_LIST, PROJECT_KEY_SETTINGS_LIST } } = permissionTypes;

function ProjectNavigationContainer({ match, promisedUserPermissions }) {
  const { params: { projectKey }, path } = match;
  return (
    <ProjectNavigation userPermissions={promisedUserPermissions.value} projectKey={projectKey}>
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
          permission={projectKeyPermission(PROJECT_KEY_STORAGE_LIST, projectKey)}
          alt={NotFoundPage} />
        <RoutePermissions
          exact
          path={`${path}/notebooks`}
          component={NotebooksPage}
          promisedUserPermissions={promisedUserPermissions}
          permission={projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey)}
          alt={NotFoundPage} />
        <RoutePermissions
          exact
          path={`${path}/publishing`}
          component={PublishingPage}
          promisedUserPermissions={promisedUserPermissions}
          permission={projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey)}
          alt={NotFoundPage} />
        <RoutePermissions
          exact
          path={`${path}/settings`}
          component={SettingsPage}
          promisedUserPermissions={promisedUserPermissions}
          permission={projectKeyPermission(PROJECT_KEY_SETTINGS_LIST, projectKey)}
          alt={NotFoundPage} />
        <Route exact path={`${path}/dask`} component={DaskPage} />
        <Route exact path={`${path}/spark`} component={SparkPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </ProjectNavigation>
  );
}

export default ProjectNavigationContainer;
