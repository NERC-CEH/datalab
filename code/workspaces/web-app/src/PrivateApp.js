import { Redirect, Route, Switch } from 'react-router-dom';
import React from 'react';
import { permissionTypes } from 'common';
import ModalRoot from './containers/modal/ModalRoot';
import NavigationContainer from './containers/app/NavigationContainer';
import ProjectNavigationContainer from './containers/app/ProjectNavigationContainer';
import AdminNavigationContainer from './containers/app/AdminNavigationContainer';
import AssetRepoNavigationContainer from './containers/app/AssetRepoNavigationContainer';
import NotFoundPage from './pages/NotFoundPage';
import ProjectsPage from './pages/ProjectsPage';
import AddAssetsToNotebookPage from './pages/AddAssetsToNotebookPage';
import RoutePermissions from './components/common/RoutePermissionWrapper';
import { useCurrentUserPermissions } from './hooks/authHooks';

const { SYSTEM_INSTANCE_ADMIN } = permissionTypes;

const PrivateApp = () => {
  const userPermissions = useCurrentUserPermissions().value;
  return (
    <NavigationContainer userPermissions={userPermissions}>
      <Switch>
        <RoutePermissions
          path="/admin"
          component={AdminNavigationContainer}
          permission={SYSTEM_INSTANCE_ADMIN}
          alt={NotFoundPage}
        />
        <RoutePermissions
          path="/assets"
          component={AssetRepoNavigationContainer}
          permission={''}
          alt={NotFoundPage}
        />
        <RoutePermissions
          exact path="/projects"
          component={ProjectsPage}
          permission=''
          alt={NotFoundPage}
        />
        <RoutePermissions
          exact
          path="/add-assets-to-notebook"
          component={AddAssetsToNotebookPage}
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
