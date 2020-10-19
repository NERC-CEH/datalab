import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { SYSTEM_INSTANCE_ADMIN } from 'common/src/permissionTypes';
import projectActions from '../../actions/projectActions';
import SideBarNavigation from '../../components/app/SideBarNavigation';
import AdminResourcesPage from '../../pages/AdminResourcesPage';
import RoutePermissions from '../../components/common/RoutePermissionWrapper';
import NotFoundPage from '../../pages/NotFoundPage';
import AdminSideBar from '../../components/app/AdminSideBar';

function AdminNavigationContainer({ promisedUserPermissions }) {
  const projectKey = 'andyl';
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(projectActions.setCurrentProject(projectKey));
  }, [dispatch, projectKey]);

  return <PureAdminNavigationContainer
    promisedUserPermissions={promisedUserPermissions}
  />;
}

function PureAdminNavigationContainer({ promisedUserPermissions }) {
  return (
    <SideBarNavigation sideBar={
            <AdminSideBar />
    }>
      <Switch>
        <RoutePermissions
          exact
          path="/admin/resources"
          component={AdminResourcesPage}
          promisedUserPermissions={promisedUserPermissions}
          permission={SYSTEM_INSTANCE_ADMIN} />
        <Redirect exact from="/admin" to="/admin/resources" />
        <Route component={NotFoundPage} />
      </Switch>
    </SideBarNavigation>
  );
}

PureAdminNavigationContainer.propTypes = {
  projectKey: PropTypes.shape({
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.string,
    error: PropTypes.any,
  }),
};

export { PureAdminNavigationContainer };

export default AdminNavigationContainer;
