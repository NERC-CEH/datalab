import React from 'react';
import { Message, Segment } from 'semantic-ui-react';

const UnauthorisedPage = () => (
  <Segment basic>
    <Message negative>
      <Message.Header>Unauthorised Access</Message.Header>
      <p>You are required to be logged in to access this content.</p>
    </Message>
  </Segment>
);

export default UnauthorisedPage;
