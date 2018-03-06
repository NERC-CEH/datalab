import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Navigation from '../../components/app/Navigation';

class NavigationContainer extends Component {
  render() {
    return (
      <Navigation {...this.props} identity={this.props.identity} />
    );
  }
}
NavigationContainer.propTypes = {
  identity: PropTypes.object.isRequired,
};

function mapStateToProps({ authentication: { identity } }) {
  return {
    identity,
  };
}

export { NavigationContainer as PureNavigationContainer }; // export for testing
export default connect(mapStateToProps)(NavigationContainer);
