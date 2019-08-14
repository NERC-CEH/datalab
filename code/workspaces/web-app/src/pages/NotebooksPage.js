import React from 'react';
import ProptTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Segment from '../components/app/Segment';
import NotebooksContainer from '../containers/notebooks/NotebooksContainer';

const NotebooksPage = ({ userPermissions }) => (
  <Segment>
    <Typography gutterBottom variant="h4">Current Notebooks</Typography>
    <NotebooksContainer userPermissions={userPermissions}/>
  </Segment>
);

NotebooksPage.propTypes = {
  userPermissions: ProptTypes.arrayOf(ProptTypes.string).isRequired,
};

export default NotebooksPage;
