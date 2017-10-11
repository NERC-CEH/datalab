import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import NotebooksContainer from '../components/notebooks/NotebooksContainer';

const PublishingPage = () => (
  <Segment basic>
    <Header as="h1">Published Items</Header>
    <NotebooksContainer />
  </Segment>
);

export default PublishingPage;
