import React from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogTitle, DialogContent, DialogActions, DialogContentText } from 'material-ui/Dialog';
import IconButton from '../common/control/IconButton';

const Confirmation = ({ title, body, onSubmit, onCancel }) => (
  <Dialog open={true} maxWidth="md">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{body}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <IconButton onClick={onCancel} icon="clear">Cancel</IconButton>
      <IconButton danger onClick={onSubmit} icon="delete" disabled={onSubmit === undefined}>Confirm Deletion</IconButton>
    </DialogActions>
  </Dialog>
);

Confirmation.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default Confirmation;
