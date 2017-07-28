import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'semantic-ui-react';

const DataStorageTableRow = ({ dataStore, openStorageAction }) => (
  <Table.Row>
    <Table.Cell>{dataStore.name}</Table.Cell>
    <Table.Cell>{dataStore.capacityUsed}</Table.Cell>
    <Table.Cell>{dataStore.capacityTotal}</Table.Cell>
    <Table.Cell>{dataStore.storageType}</Table.Cell>
    <Table.Cell>
      <Button primary onClick={() => openStorageAction(dataStore.linkToStorage, dataStore.accessKey) }>Open</Button>
    </Table.Cell>
  </Table.Row>
);

DataStorageTableRow.propTypes = {
  dataStore: PropTypes.shape({
    capacityTotal: PropTypes.number,
    capacityUsed: PropTypes.number,
    linkToStorage: PropTypes.string,
    name: PropTypes.string,
    storageType: PropTypes.string,
  }),
};

export default DataStorageTableRow;
