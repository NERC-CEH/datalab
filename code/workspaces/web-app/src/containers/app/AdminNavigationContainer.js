import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { permissionTypes } from 'common';
import SideBarNavigation from '../../components/app/SideBarNavigation';
import AdminResourcesPage from '../../pages/AdminResourcesPage';
import AdminUsersPage from '../../pages/AdminUsersPage';
import RoutePermissions from '../../components/common/RoutePermissionWrapper';
import NotFoundPage from '../../pages/NotFoundPage';
import AdminSideBar from '../../components/app/AdminSideBar';

const { SYSTEM_INSTANCE_ADMIN } = permissionTypes;

function AdminNavigationContainer() {
  return (
    <SideBarNavigation sideBar={
      <AdminSideBar />
    }>
      <Switch>
        <RoutePermissions
          exact
          path="/admin/resources"
          component={AdminResourcesPage}
          permission={SYSTEM_INSTANCE_ADMIN}
        />
        <RoutePermissions
          exact
          path="/admin/users"
          component={AdminUsersPage}
          permission={SYSTEM_INSTANCE_ADMIN}
        />
        <Redirect exact from="/admin" to="/admin/resources" />
        <Route component={NotFoundPage} />
      </Switch>
    </SideBarNavigation>
  );
}

export default AdminNavigationContainer;
