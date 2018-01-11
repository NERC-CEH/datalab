import React from 'react';
import Typography from 'material-ui/Typography';
import Segment from '../components/app/Segment';
import DataStorageContainer from '../containers/dataStorage/DataStorageContainer';

const DataStoragePage = () => (
  <Segment>
    <Typography gutterBottom type="display1">Current Storage Volumes</Typography>
    <DataStorageContainer />
  </Segment>
);

export default DataStoragePage;
