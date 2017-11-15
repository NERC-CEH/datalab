import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import DataStorageTableRow from './DataStorageTableRow';

const DataStorageTable = ({ dataStorage, openStorageAction }) => (
  <Paper>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Capacity Used</TableCell>
          <TableCell>Capacity Total</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Link</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dataStorage.map((dataStore, index) => (
          <DataStorageTableRow
            key={index}
            dataStore={dataStore}
            openStorageAction={openStorageAction} />
        ))}
      </TableBody>
    </Table>
  </Paper>
);

DataStorageTable.propTypes = {
  dataStorage: PropTypes.arrayOf(PropTypes.object),
};

export default DataStorageTable;
