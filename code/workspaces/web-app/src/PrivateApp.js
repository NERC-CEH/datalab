import { Redirect, Route, Switch } from 'react-router-dom';
import React from 'react';
import ModalRoot from './containers/modal/ModalRoot';
import NavigationContainer from './containers/app/NavigationContainer';
import ProjectNavigationContainer from './containers/app/ProjectNavigationContainer';
import AdminNavigationContainer from './containers/app/AdminNavigationContainer';
import NotFoundPage from './pages/NotFoundPage';
import ProjectsPage from './pages/ProjectsPage';
import RoutePermissions from './components/common/RoutePermissionWrapper';
import { useCurrentUserPermissions } from './hooks/authHooks';

const PrivateApp = () => {
  const userPermissions = useCurrentUserPermissions().value;
  return (
    <NavigationContainer userPermissions={userPermissions}>
      <Switch>
        <Route path="/admin">
          <AdminNavigationContainer />
        </Route>
        <RoutePermissions
          exact path="/projects"
          component={ProjectsPage}
          permission=''
          alt={NotFoundPage}
        />
        <Route path="/projects/:projectKey" >
          <ProjectNavigationContainer />
        </Route>
        <Redirect exact from="/" to="/projects" />
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
      <ModalRoot />
    </NavigationContainer>
  );
};

export default PrivateApp;
