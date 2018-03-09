import React from 'react';

function PermissionWrapper(permission, userPermissions, NegativeComponent) {
  const unauthorised = NegativeComponent && (props => (<NegativeComponent {...props} />));

  return (WrappedComponent) => {
    if (userPermissions.includes(permission)) {
      return props => (<WrappedComponent userPermissions={userPermissions} {...props} />);
    }

    return unauthorised || null;
  };
}

export default PermissionWrapper;
