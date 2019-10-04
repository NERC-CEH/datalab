import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SYSTEM_INSTANCE_ADMIN } from 'common/src/permissionTypes';

class ComponentWrapper extends Component {
  hasPermission() {
    const { userPermissions, permission } = this.props;
    return userPermissions.includes(permission) || userPermissions.includes(SYSTEM_INSTANCE_ADMIN);
  }

  render() {
    if (this.hasPermission()) {
      return (
        <div style={this.props.style} className={this.props.className}>
          {this.props.children}
        </div>
      );
    }

    return (null);
  }
}

ComponentWrapper.propTypes = {
  permission: PropTypes.string.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  style: PropTypes.object,
};

export default ComponentWrapper;
