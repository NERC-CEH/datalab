import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

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
        <Button id="cancel-button" onClick={() => setState(closedState)}>Cancel</Button>
        <Button
          id="confirm-button"
          className={classes.dialogDeleteUserButton}
          variant="outlined"
          onClick={() => {
            onRemoveConfirmationFn(project, state.user, dispatch);
            setState(closedState);
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
