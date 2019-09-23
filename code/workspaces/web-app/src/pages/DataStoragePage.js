import React from 'react';
import PropTypes from 'prop-types';
import DataStorageContainer from '../containers/dataStorage/DataStorageContainer';
import Page from './Page';

const DataStoragePage = ({ userPermissions, match }) => (
  <Page title="Storage">
    <DataStorageContainer userPermissions={userPermissions} projectKey={match.params.projectKey} />
  </Page>
);

DataStorageContainer.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  projectKey: PropTypes.string.isRequired,
};

export default DataStoragePage;
