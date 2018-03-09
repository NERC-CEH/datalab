import React from 'react';
import PropTypes from 'prop-types';

function PermissionWrapper(permission, userPermissions, NegativeComponent) {
  const unauthorised = NegativeComponent && (props => (<NegativeComponent {...props} />));

  return (WrappedComponent) => {
    if (userPermissions.includes(permission)) {
      return props => (<WrappedComponent userPermissions={userPermissions} {...props} />);
    }

    return unauthorised || null;
  };
}

PermissionWrapper.propTypes = {
  permission: PropTypes.string.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  NegativeComponent: PropTypes.element,
};

export default PermissionWrapper;
