import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { SYSTEM_INSTANCE_ADMIN } from 'common/src/permissionTypes';
import { useCurrentUserPermissions } from '../../hooks/authHooks';

const showWrappedComponent = (fetching, userPermissions, permission) => !fetching && (!permission
  || userPermissions.includes(permission)
  || userPermissions.includes(SYSTEM_INSTANCE_ADMIN));

const RoutePermissionWrapper = ({ path, exact, permission, component, alt, redirectTo }) => {
  const { value: userPermissions, fetching } = useCurrentUserPermissions();

  const getComponent = () => {
    const WrappedComponent = component;
    const NegativeComponent = alt;

    if (fetching) return <CircularProgress />;

    if (showWrappedComponent(fetching, userPermissions, permission)) {
      return <WrappedComponent userPermissions={userPermissions} />;
    }

    if (redirectTo) return <Redirect to={redirectTo} />;
    if (NegativeComponent) return <NegativeComponent />;
    return null;
  };

  return (
    <Route path={path} exact={exact}>
      {getComponent()}
    </Route>
  );
};

RoutePermissionWrapper.propTypes = {
  path: PropTypes.string,
  exact: PropTypes.bool,
  permission: PropTypes.string.isRequired,
  component: PropTypes.elementType.isRequired,
  alt: PropTypes.elementType,
  redirectTo: PropTypes.string,
};

export default RoutePermissionWrapper;
