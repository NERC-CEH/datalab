import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from './control/IconButton';

function ConfirmDialog({ state, onSubmit, title, body, onCancel }) {
  if (!state.open) return null;

  return (
    <Dialog open={state.open} maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={onSubmit} icon="check">Confirm</IconButton>
        <IconButton onClick={onCancel} icon="clear">Cancel</IconButton>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default ConfirmDialog;
