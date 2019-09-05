import React from 'react';
import ProptTypes from 'prop-types';
import NotebooksContainer from '../containers/notebooks/NotebooksContainer';
import Page from './Page';

const NotebooksPage = ({ userPermissions }) => (
  <Page title="Notebooks">
    <NotebooksContainer userPermissions={userPermissions}/>
  </Page>
);

NotebooksPage.propTypes = {
  userPermissions: ProptTypes.arrayOf(ProptTypes.string).isRequired,
};

export default NotebooksPage;
