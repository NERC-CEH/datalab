import React from 'react';
import PropTypes from 'prop-types';
import NotebooksContainer from '../containers/notebooks/NotebooksContainer';
import Page from './Page';

const NotebooksPage = ({ userPermissions, match }) => (
  <Page title="Notebooks">
    <NotebooksContainer userPermissions={userPermissions} projectKey={match.params.projectKey} />
  </Page>
);

NotebooksPage.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default NotebooksPage;
