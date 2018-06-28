import React from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogTitle, DialogContent, DialogActions, DialogContentText } from 'material-ui/Dialog';
import IconButton from '../common/control/IconButton';

const EditDataStoreDialog = ({ onCancel, title, currentUsers, userList }) => (
  <Dialog open={true} maxWidth="md">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{JSON.stringify(currentUsers)}</DialogContentText>
      <DialogContentText>{JSON.stringify(userList)}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <IconButton onClick={onCancel} icon="clear">Close</IconButton>
    </DialogActions>
  </Dialog>
);

EditDataStoreDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  // currentUsers: PropTypes.array.isRequired,
  // userList: PropTypes.array.isRequired,
};

export default EditDataStoreDialog;
