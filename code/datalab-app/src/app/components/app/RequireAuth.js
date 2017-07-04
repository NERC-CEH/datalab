import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import auth from '../../auth/auth';

const RequireAuth = ({ user, component: Component, ...rest }) => (
  auth.isAuthenticated(user) ? (
    <Route {...rest} render={props => <Component {...props} />} />
  ) : (
    <div>
      <p><strong>You are required to be logged in to access this content.</strong></p>
    </div>
  )
);

function mapStateToProps({ authentication: { user } }) {
  return {
    user,
  };
}

export default connect(mapStateToProps)(RequireAuth);
