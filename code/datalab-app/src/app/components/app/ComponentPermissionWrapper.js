import React, { Component } from 'react';

class ComponentWrapper extends Component {
  hasPermission() {
    const userPermissions = this.props.userPermissions;
    const permission = this.props.permission;
    return userPermissions.includes(permission);
  }

  render() {
    if (this.hasPermission()) {
      return (
        <div>
          {this.props.children}
        </div>
      );
    }

    return (null);
  }
}

export default ComponentWrapper;
