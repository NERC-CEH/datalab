import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ComponentWrapper extends Component {
  hasPermission() {
    const { userPermissions } = this.props;
    const { permission } = this.props;
    return userPermissions.includes(permission);
  }

  render() {
    if (this.hasPermission()) {
      return (
        <div style={this.props.style}>
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
