import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { permissionTypes } from 'common';
import { SYSTEM_INSTANCE_ADMIN } from 'common/src/permissionTypes';

const { projectKeyPermission } = permissionTypes;

class RoutePermissionWrapper extends Component {
  showWrappedComponent = (fetching, userPermissions, permission, projectKey) => !fetching && (!permission
      || userPermissions.includes(projectKeyPermission(permission, projectKey))
      || userPermissions.includes(SYSTEM_INSTANCE_ADMIN));

  getComponent() {
    const { value, fetching } = this.props.promisedUserPermissions;
    const WrappedComponent = this.props.component;
    const NegativeComponent = this.props.alt;

    if (fetching) {
      return () => (<CircularProgress />);
    }

    if (this.showWrappedComponent(fetching, value, this.props.permission, this.props.projectKey)) {
      return props => (<WrappedComponent userPermissions={value} {...props} />);
    }

    if (!fetching && NegativeComponent) {
      return props => (<NegativeComponent {...props} />);
    }

    return null;
  }

  render() {
    const { path, exact } = this.props;

    return (<Route path={path} exact={exact} render={this.getComponent()} />);
  }
}

RoutePermissionWrapper.propTypes = {
  path: PropTypes.string,
  exact: PropTypes.bool,
  permission: PropTypes.string.isRequired,
  projectKey: PropTypes.string,
  promisedUserPermissions: PropTypes.shape({
    error: PropTypes.any,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  component: PropTypes.func.isRequired,
  alt: PropTypes.func,
};

export default RoutePermissionWrapper;
