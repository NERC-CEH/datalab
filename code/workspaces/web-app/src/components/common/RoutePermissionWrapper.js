import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

class RoutePermissionWrapper extends Component {
  showWrappedComponent = (fetching, userPermissions, permission) => !fetching && (!permission || userPermissions.includes(permission));

  getComponent() {
    const { value, fetching } = this.props.promisedUserPermissions;
    const WrappedComponent = this.props.component;
    const NegativeComponent = this.props.alt;

    if (fetching) {
      return () => (<CircularProgress />);
    }

    if (this.showWrappedComponent(fetching, value, this.props.permission)) {
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
  promisedUserPermissions: PropTypes.shape({
    error: PropTypes.any,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  component: PropTypes.func.isRequired,
  alt: PropTypes.func,
};

export default RoutePermissionWrapper;
