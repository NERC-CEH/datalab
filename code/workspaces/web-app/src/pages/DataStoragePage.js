import React from 'react';
import PropTypes from 'prop-types';
import DataStorageContainer from '../containers/dataStorage/DataStorageContainer';
import Page from './Page';

const DataStoragePage = ({ userPermissions }) => (
  <Page title="Storage">
    <DataStorageContainer userPermissions={userPermissions} />
  </Page>
);

DataStorageContainer.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DataStoragePage;
