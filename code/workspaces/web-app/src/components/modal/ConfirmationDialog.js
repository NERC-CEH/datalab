import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import SecondaryActionButton from '../common/buttons/SecondaryActionButton';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';

const ConfirmationDialog = ({ onSubmit, title, body, onCancel }) => (
  <Dialog open={true} maxWidth="md">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography variant="body1">{body}</Typography>
    </DialogContent>
    <DialogActions>
      <PrimaryActionButton onClick={onSubmit} icon="check">Confirm</PrimaryActionButton>
      <SecondaryActionButton onClick={onCancel} icon="clear">Cancel</SecondaryActionButton>
    </DialogActions>
  </Dialog>
);

ConfirmationDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default ConfirmationDialog;
