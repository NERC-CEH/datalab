import React from 'react';
import { Divider, Header, Segment } from 'semantic-ui-react';
import NotebooksContainer from '../components/notebooks/NotebooksContainer';
import CreateNotebookContainer from '../components/notebooks/CreateNotebookContainer';

const NotebooksPage = () => (
  <Segment basic>
    <Header as="h1">Current Notebooks</Header>
    <NotebooksContainer />
    <Divider/>
    <CreateNotebookContainer />
  </Segment>
);

export default NotebooksPage;
