import React from 'react';
import { connect } from 'react-redux';
import { Button, Header, Segment } from 'semantic-ui-react';
import auth from '../auth/auth';

const HomePage = ({ user }) => (
  <Segment basic>
    <Header as="h1">Home Page</Header>
    <p>This is the data lab home page.</p>
    <p>{`You are ${auth.isAuthenticated(user) ? 'logged in.' : 'not logged in.'}`}</p>
    <Button primary onClick={() => auth.logout()}>Logout</Button>
  </Segment>
);

function mapStateToProps({ authentication: { user } }) {
  return { user };
}

export default connect(mapStateToProps)(HomePage);
