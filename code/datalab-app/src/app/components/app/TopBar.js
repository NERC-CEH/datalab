import React from 'react';
import { Button, Segment } from 'semantic-ui-react';
import auth from '../../auth/auth';

const TopBar = ({ topBarStyle }) => (
  <Segment basic inverted textAlign="right" style={topBarStyle}>
    <Button primary onClick={() => auth.logout()}>Logout</Button>
  </Segment>
);

export default TopBar;
