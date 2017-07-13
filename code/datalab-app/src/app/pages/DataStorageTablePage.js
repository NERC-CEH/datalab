import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import DataStorageContainer from '../components/datastorage/DataStorageTableContainer';

const DataStoragePage = () => (
  <Segment basic>
    <Header as="h1">Current Storage Volumes</Header>
    <DataStorageContainer />
  </Segment>
);

export default DataStoragePage;
