import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import NotebooksContainer from '../components/notebooks/NotebooksContainer';

const NotebooksPage = () => (
  <Segment basic>
    <Header as="h1">Current Notebooks</Header>
    <NotebooksContainer />
  </Segment>
);

export default NotebooksPage;
