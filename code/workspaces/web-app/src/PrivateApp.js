import { Redirect, Route, Switch } from 'react-router-dom';
import { matchPath } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { permissionTypes } from 'common';
import DaskPage from './pages/DaskPage';
import DataStoragePage from './pages/DataStoragePage';
import ModalRoot from './containers/modal/ModalRoot';
import NavigationContainer from './containers/app/NavigationContainer';
import NotebooksPage from './pages/NotebooksPage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectInfoPage from './pages/ProjectInfoPage';
import PublishingPage from './pages/PublishingPage';
import RoutePermissions from './components/common/RoutePermissionWrapper';
import SparkPage from './pages/SparkPage';
import SettingsPage from './pages/SettingsPage';

const { projectPermissions: { PROJECT_KEY_STORAGE_LIST, PROJECT_KEY_STACKS_LIST, PROJECT_KEY_SETTINGS_LIST } } = permissionTypes;

const projectKey = (pathname) => {
  const match = matchPath(pathname, {
    path: '/projects/:projectKey',
  });
  return match && match.params.projectKey;
};

const PrivateApp = ({ promisedUserPermissions, location }) => (
  <NavigationContainer
    userPermissions={promisedUserPermissions.value}
    projectKey={projectKey(location.pathname)}
  >
    <Switch>
      <RoutePermissions
        exact path="/projects"
        component={ProjectsPage}
        promisedUserPermissions={promisedUserPermissions}
        permission=''
        alt={NotFoundPage} />
      />
      <Redirect exact from="/" to="/projects" />
      <Route
        exact
        path="/projects/:projectKey/info"
        component={ProjectInfoPage} />
      <RoutePermissions
        exact
        path="/projects/:projectKey/storage"
        component={DataStoragePage}
        promisedUserPermissions={promisedUserPermissions}
        permission={PROJECT_KEY_STORAGE_LIST}
        projectKey={projectKey(location.pathname)}
        alt={NotFoundPage} />
      <RoutePermissions
        exact
        path="/projects/:projectKey/notebooks"
        component={NotebooksPage}
        promisedUserPermissions={promisedUserPermissions}
        permission={PROJECT_KEY_STACKS_LIST}
        projectKey={projectKey(location.pathname)}
        alt={NotFoundPage} />
      <RoutePermissions
        exact
        path="/projects/:projectKey/publishing"
        component={PublishingPage}
        promisedUserPermissions={promisedUserPermissions}
        permission={PROJECT_KEY_STACKS_LIST}
        projectKey={projectKey(location.pathname)}
        alt={NotFoundPage} />
      <RoutePermissions
        exact
        path="/projects/:projectKey/settings"
        component={SettingsPage}
        promisedUserPermissions={promisedUserPermissions}
        permission={PROJECT_KEY_SETTINGS_LIST}
        projectKey={projectKey(location.pathname)}
        alt={NotFoundPage} />
      <Route exact path="/projects/:projectKey/dask" component={DaskPage} />
      <Route exact path="/projects/:projectKey/spark" component={SparkPage} />
      <Route component={NotFoundPage} />
    </Switch>
    <ModalRoot />
  </NavigationContainer>
);

PrivateApp.propTypes = {
  promisedUserPermissions: PropTypes.shape({
    error: PropTypes.any,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.array.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default PrivateApp;
