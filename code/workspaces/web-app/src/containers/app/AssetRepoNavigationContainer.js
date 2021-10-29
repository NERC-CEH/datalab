import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { permissionTypes } from 'common';
import SideBarNavigation from '../../components/app/SideBarNavigation';
import AssetRepoAddMetadataPage from '../../pages/AssetRepoAddMetadataPage';
import AssetRepoFindPage from '../../pages/AssetRepoFindPage';
import AddAssetsToNotebookPage from '../../pages/AddAssetsToNotebookPage';
import RoutePermissions from '../../components/common/RoutePermissionWrapper';
import NotFoundPage from '../../pages/NotFoundPage';
import AssetRepoSideBar from '../../components/app/AssetRepoSideBar';

const { SYSTEM_DATA_MANAGER } = permissionTypes;

function AssetRepoNavigationContainer() {
  return (
    <SideBarNavigation sideBar={
      <AssetRepoSideBar />
    }>
      <Switch>
        <RoutePermissions
          exact
          path="/assets/add-metadata"
          component={AssetRepoAddMetadataPage}
          permission={SYSTEM_DATA_MANAGER}
        />
        <RoutePermissions
          exact
          path="/assets/find"
          component={AssetRepoFindPage}
          permission={SYSTEM_DATA_MANAGER}
        />
        <RoutePermissions
          exact
          path="/assets/add-to-notebook"
          component={AddAssetsToNotebookPage}
          permission={SYSTEM_DATA_MANAGER}
        />
        <Redirect exact from="/assets" to="/assets/add-metadata" />
        <Route component={NotFoundPage} />
      </Switch>
    </SideBarNavigation>
  );
}

export default AssetRepoNavigationContainer;
