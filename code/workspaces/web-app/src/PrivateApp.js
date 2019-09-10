import { Redirect, Route, Switch } from 'react-router-dom';
import { matchPath } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { permissionTypes } from 'common';
import DaskPage from './pages/DaskPage';
import DataStoragePage from './pages/DataStoragePage';
import InfoPage from './pages/InfoPage';
import ModalRoot from './containers/modal/ModalRoot';
import NavigationContainer from './containers/app/NavigationContainer';
import NotebooksPage from './pages/NotebooksPage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectsPage from './pages/ProjectsPage';
import PublishingPage from './pages/PublishingPage';
import RoutePermissions from './components/common/RoutePermissionWrapper';
import SparkPage from './pages/SparkPage';
import SettingsPage from './pages/SettingsPage';

const { projectPermissions: { PROJECT_STORAGE_LIST, PROJECT_STACKS_LIST, PROJECT_SETTINGS_LIST } } = permissionTypes;

// const projectKey = pathname => pathname.split('/')[2];
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
        permission={PROJECT_STACKS_LIST}
        alt={NotFoundPage} />
      />
      <Redirect exact from="/" to="/projects" />
      <RoutePermissions
        exact
        path="/projects/:projectKey/info"
        component={InfoPage}
        promisedUserPermissions={promisedUserPermissions}
        permission={PROJECT_STORAGE_LIST}
        alt={NotFoundPage} />
      <RoutePermissions
        exact
        path="/projects/:projectKey/storage"
        component={DataStoragePage}
        promisedUserPermissions={promisedUserPermissions}
        permission={PROJECT_STORAGE_LIST}
        alt={NotFoundPage} />
      <RoutePermissions
        exact
        path="/projects/:projectKey/notebooks"
        component={NotebooksPage}
        promisedUserPermissions={promisedUserPermissions}
        permission={PROJECT_STACKS_LIST}
        alt={NotFoundPage} />
      <RoutePermissions
        exact
        path="/projects/:projectKey/publishing"
        component={PublishingPage}
        promisedUserPermissions={promisedUserPermissions}
        permission={PROJECT_STACKS_LIST}
        alt={NotFoundPage} />
      <RoutePermissions
        exact
        path="/projects/:projectKey/settings"
        component={SettingsPage}
        promisedUserPermissions={promisedUserPermissions}
        permission={PROJECT_SETTINGS_LIST}
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
};

export default PrivateApp;
