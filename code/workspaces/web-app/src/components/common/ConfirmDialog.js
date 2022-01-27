import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import PrimaryActionButton from './buttons/PrimaryActionButton';
import SecondaryActionButton from './buttons/SecondaryActionButton';
import theme from '../../theme';

function ConfirmDialog({ state, onSubmit, title, body, onCancel }) {
  if (!state.open) return null;

  return (
    <Dialog open={state.open} maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <PrimaryActionButton
          onClick={onSubmit}
        >
          Confirm
        </PrimaryActionButton>
        <SecondaryActionButton
          style={{ marginLeft: theme.spacing(1) }}
          onClick={onCancel}
        >
          Cancel
        </SecondaryActionButton>
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
