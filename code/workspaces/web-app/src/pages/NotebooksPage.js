import React from 'react';
import PropTypes from 'prop-types';
import NotebooksContainer from '../containers/notebooks/NotebooksContainer';
import Page from './Page';

const NotebooksPage = ({ userPermissions }) => (
  <Page title="Notebooks">
    <NotebooksContainer userPermissions={userPermissions} />
  </Page>
);

NotebooksPage.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default NotebooksPage;
