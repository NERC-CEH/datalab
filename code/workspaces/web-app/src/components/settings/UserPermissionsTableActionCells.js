import React from 'react';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import { PERMISSION_VALUES } from '../../constants/permissions';

export function CheckboxCell({ user, isCurrentUser, currentUserSystemAdmin, checkboxSpec, projectKey, classes, cellKey, actions, dispatch }) {
  return (
    <TableCell
      className={classes.tableCell}
      padding="checkbox"
      align="center"
      key={cellKey}
    >
      <PermissionsCheckbox
        user={user}
        isCurrentUser={isCurrentUser}
        currentUserSystemAdmin={currentUserSystemAdmin}
        checkboxSpec={checkboxSpec}
        projectKey={projectKey}
        classes={classes}
        actions={actions}
        dispatch={dispatch}
      />
    </TableCell>
  );
}

export function PermissionsCheckbox({ user, isCurrentUser, currentUserSystemAdmin, checkboxSpec, projectKey, classes, actions, dispatch }) {
  const props = { checked: true, color: 'default' };
  if (user.role === checkboxSpec.name) {
    props.className = classes.activeSelection;
  } else if (PERMISSION_VALUES[user.role.toUpperCase()] > checkboxSpec.value) {
    props.className = classes.implicitSelection;
  } else {
    props.checked = false;
  }

  if (isCurrentUser && !currentUserSystemAdmin) props.disabled = true;

  return <Checkbox {...props} onClick={() => actions.addUserPermission(projectKey, user, checkboxSpec.name, dispatch)}/>;
}

export function RemoveUserButtonCell({ user, isCurrentUser, currentUserSystemAdmin, classes, setRemoveUserDialogState }) {
  return (
    <TableCell className={classes.tableCell} padding="checkbox" align="center">
      <IconButton
        disabled={isCurrentUser && !currentUserSystemAdmin}
        onClick={() => {
          setRemoveUserDialogState({ user, open: true });
        }}
        size="large">
        <Icon>{'remove_circle_outline'}</Icon>
      </IconButton>
    </TableCell>
  );
}
