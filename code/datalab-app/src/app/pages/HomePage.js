import React from 'react';
import { connect } from 'react-redux';
import auth from '../auth/auth';

const HomePage = ({ user }) => (
  <div>
    <h1>Home Page</h1>
    <p>This is the data lab home page.</p>
    <p>{`You are ${auth.isAuthenticated(user) ? 'logged in.' : 'not logged in.'}`}</p>
  </div>
);

function mapStateToProps({ authentication: { user } }) {
  return { user };
}

export default connect(mapStateToProps)(HomePage);
