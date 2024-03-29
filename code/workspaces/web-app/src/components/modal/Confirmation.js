import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '../common/control/IconButton';

const bodyToContent = (body) => {
  // Handle writing the body as either an individual, or a list of elements.
  if (Array.isArray(body)) {
    const contentTexts = body.map((t, i) => (<DialogContentText key={i}>{t}</DialogContentText>));

    return (
      <DialogContent>
        {contentTexts}
      </DialogContent>
    );
  }

  return (
    <DialogContent>
      <DialogContentText>{body}</DialogContentText>
    </DialogContent>
  );
};

const Confirmation = ({ title, body, onSubmit, onCancel, confirmText = 'Confirm Deletion', confirmIcon = 'delete', danger = true }) => (
  <Dialog open={true} maxWidth="md">
    <DialogTitle>{title}</DialogTitle>
    {bodyToContent(body)}
    <DialogActions>
      <IconButton onClick={onCancel} icon="clear" size="large">Cancel</IconButton>
      <IconButton
        danger={danger}
        onClick={onSubmit}
        icon={confirmIcon}
        disabled={onSubmit === undefined}
        size="large">{confirmText}</IconButton>
    </DialogActions>
  </Dialog>
);

Confirmation.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.arrayOf(PropTypes.string).isRequired]),
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
};

export default Confirmation;
