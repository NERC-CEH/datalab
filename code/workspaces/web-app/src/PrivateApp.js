import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import ModalRoot from './containers/modal/ModalRoot';
import NavigationContainer from './containers/app/NavigationContainer';
import ProjectNavigationContainer from './containers/app/ProjectNavigationContainer';
import AdminNavigationContainer from './containers/app/AdminNavigationContainer';
import NotFoundPage from './pages/NotFoundPage';
import ProjectsPage from './pages/ProjectsPage';
import RoutePermissions from './components/common/RoutePermissionWrapper';

const PrivateApp = ({ promisedUserPermissions }) => (
  <NavigationContainer userPermissions={promisedUserPermissions.value}>
    <Switch>
      <Route
        path="/admin"
        render={() => <AdminNavigationContainer promisedUserPermissions={promisedUserPermissions} />}
      />
      <RoutePermissions
        exact path="/projects"
        component={ProjectsPage}
        promisedUserPermissions={promisedUserPermissions}
        permission=''
        alt={NotFoundPage} />
      <Route
        path="/projects/:projectKey"
        render={({ match }) => <ProjectNavigationContainer match={match} promisedUserPermissions={promisedUserPermissions} />}
      />
      <Redirect exact from="/" to="/projects" />
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
