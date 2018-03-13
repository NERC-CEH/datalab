import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import NavigationContainer from './containers/app/NavigationContainer';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/app/Footer';
import LandingPage from './pages/LandingPage';
import DataStoragePage from './pages/DataStoragePage';
import NotebooksPage from './pages/NotebooksPage';
import PublishingPage from './pages/PublishingPage';
import DaskPage from './pages/DaskPage';
import SparkPage from './pages/SparkPage';
import ModalRoot from './containers/modal/ModalRoot';
import RoutePermissions from './components/common/RoutePermissionWrapper';
import { projectPermissions } from '../shared/permissionTypes';

const { PROJECT_STORAGE_LIST, PROJECT_STACKS_LIST } = projectPermissions;

const PrivateApp = ({ promisedUserPermissions }) => (
  <NavigationContainer userPermissions={promisedUserPermissions.value}>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <RoutePermissions
        exact
        path="/storage"
        component={DataStoragePage}
        promisedUserPermissions={promisedUserPermissions}
        permission={PROJECT_STORAGE_LIST}
        alt={NotFoundPage} />
      <RoutePermissions
        exact
        path="/notebooks"
        component={NotebooksPage}
        promisedUserPermissions={promisedUserPermissions}
        permission={PROJECT_STACKS_LIST}
        alt={NotFoundPage} />
      <RoutePermissions
        exact
        path="/publishing"
        component={PublishingPage}
        promisedUserPermissions={promisedUserPermissions}
        permission={PROJECT_STACKS_LIST}
        alt={NotFoundPage} />
      <Route exact path="/dask" component={DaskPage} />
      <Route exact path="/spark" component={SparkPage} />
      <Route component={NotFoundPage} />
    </Switch>
    <Route component={Footer} />
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
