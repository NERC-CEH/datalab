import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Navigation from '../../components/app/Navigation';

const NavigationContainer = ({ ...props }) => (
  <Navigation {...props} identity={this.props.identity} />
);

NavigationContainer.propTypes = {
  identity: PropTypes.object.isRequired,
};

function mapStateToProps({ authentication: { identity } }) {
  return {
    identity,
  };
}

export default connect(mapStateToProps)(Navigation);
