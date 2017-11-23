import React from 'react';
import Typography from 'material-ui/Typography';
import Segment from '../components/app/Segment';
import NotebooksContainer from '../containers/notebooks/NotebooksContainer';

const NotebooksPage = () => (
  <Segment>
    <Typography gutterBottom type="display1">Current Notebooks</Typography>
    <NotebooksContainer />
  </Segment>
);

export default NotebooksPage;
