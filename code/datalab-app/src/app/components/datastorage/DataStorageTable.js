import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import DataStorageTableRow from './DataStorageTableRow';

const DataStorageTable = ({ dataStorage, openStorageAction }) => (
  <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Capacity Used</Table.HeaderCell>
        <Table.HeaderCell>Capacity Total</Table.HeaderCell>
        <Table.HeaderCell>Type</Table.HeaderCell>
        <Table.HeaderCell>Link</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {dataStorage.map((dataStore, index) => (
        <DataStorageTableRow
          key={index}
          dataStore={dataStore}
          openStorageAction={openStorageAction} />
      ))}
    </Table.Body>
  </Table>
);

DataStorageTable.propTypes = {
  dataStorage: PropTypes.arrayOf(PropTypes.object),
};

export default DataStorageTable;

