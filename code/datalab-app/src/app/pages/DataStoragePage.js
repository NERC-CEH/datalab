import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Segment from '../components/app/Segment';
import DataStorageContainer from '../containers/dataStorage/DataStorageContainer';

const DataStoragePage = ({ userPermissions }) => (
  <Segment>
    <Typography gutterBottom type="display1">Current Storage Volumes</Typography>
    <DataStorageContainer userPermissions={userPermissions} />
  </Segment>
);

DataStorageContainer.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DataStoragePage;
