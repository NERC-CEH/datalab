import React from 'react';
import { SYSTEM_INSTANCE_ADMIN } from 'common/src/permissionTypes';
import { useCurrentUserPermissions } from '../../hooks/authHooks';

export const ComponentWrapper = ({ permission, userPermissions, children, style = undefined, className = undefined }) => {
  const hasPermission = userPermissions && (userPermissions.includes(permission) || userPermissions.includes(SYSTEM_INSTANCE_ADMIN));

  return hasPermission ? (<div style={style} className={className}>{children}</div>) : null;
};

export const CurrentUserPermissionWrapper = (props) => {
  const userPermissions = useCurrentUserPermissions();
  return <ComponentWrapper userPermissions={userPermissions.value} {...props} />;
};

export default ComponentWrapper;
