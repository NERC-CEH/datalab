import React from 'react';
import { Table } from 'semantic-ui-react';

const DataStorageTableRow = ({ dataStore }) => (
  <Table.Row>
    <Table.Cell>{dataStore.name}</Table.Cell>
    <Table.Cell>{dataStore.capacityUsed}</Table.Cell>
    <Table.Cell>{dataStore.capacityTotal}</Table.Cell>
    <Table.Cell>{dataStore.storageType}</Table.Cell>
    <Table.Cell>{dataStore.linkToStorage}</Table.Cell>
  </Table.Row>
);

export default DataStorageTableRow;
