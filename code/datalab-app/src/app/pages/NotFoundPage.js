import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <Segment basic>
    <Header as="h4">404 Page Not Found</Header>
    <p><Link to="/">Go to homepage</Link></p>
  </Segment>
);

export default NotFoundPage;
