import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import SecondaryActionButton from '../common/buttons/SecondaryActionButton';
import DangerButton from '../common/buttons/DangerButton';

export default function RemoveUserDialog({ classes, state, setState, onRemoveConfirmationFn, projectKey, dispatch }) {
  if (!state.open) return null;

  const closedState = { user: null, open: false };
  return (
    <Dialog open={state.open}>
      <DialogTitle>Remove User Permissions?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Are you sure you want to remove all project permissions for ${state.user.name}?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <DangerButton
          id="remove-button"
          className={classes.dialogDeleteUserButton}
          variant="outlined"
          onClick={() => {
            onRemoveConfirmationFn(projectKey, state.user, dispatch);
            setState(closedState);
          }}
        >
          Remove
        </DangerButton>
        <SecondaryActionButton id="cancel-button" onClick={() => setState(closedState)}>
          Cancel
        </SecondaryActionButton>
      </DialogActions>
    </Dialog>
  );
}
