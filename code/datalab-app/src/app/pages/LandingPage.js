import React from 'react';
import { connect } from 'react-redux';
import { Header, Segment } from 'semantic-ui-react';
import auth from '../auth/auth';

const LandingPage = ({ user }) => (
  <Segment basic>
    <Header as="h1">Home Page</Header>
    <p>This is the data lab home page.</p>
    <p>{`You are ${auth.isAuthenticated(user) ? 'logged in.' : 'not logged in.'}`}</p>
  </Segment>
);

function mapStateToProps({ authentication: { user } }) {
  return { user };
}

export default connect(mapStateToProps)(LandingPage);
