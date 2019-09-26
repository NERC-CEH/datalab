import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import SecondaryActionButton from '../common/buttons/SecondaryActionButton';
import DangerButton from '../common/buttons/DangerButton';

export default function RemoveUserDialog({ classes, state, setState, onRemoveConfirmationFn, project, dispatch }) {
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
            onRemoveConfirmationFn(project, state.user, dispatch);
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
