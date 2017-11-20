import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';

const DataStorageTableRow = ({ dataStore, openStorageAction }) => (
  <TableRow>
    <TableCell>{dataStore.name}</TableCell>
    <TableCell>{dataStore.capacityUsed}</TableCell>
    <TableCell>{dataStore.capacityTotal}</TableCell>
    <TableCell>{dataStore.storageType}</TableCell>
    <TableCell>
      <Button color="accent" raised onClick={() => openStorageAction(dataStore.linkToStorage, dataStore.accessKey)}>Open</Button>
    </TableCell>
  </TableRow>
);

DataStorageTableRow.propTypes = {
  dataStore: PropTypes.shape({
    capacityTotal: PropTypes.number,
    capacityUsed: PropTypes.number,
    linkToStorage: PropTypes.string,
    name: PropTypes.string,
    storageType: PropTypes.string,
    accessKey: PropTypes.string,
  }),
};

export default DataStorageTableRow;
