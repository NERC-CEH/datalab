import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { PERMISSION_VALUES } from '../../constants/permissions';

export function CheckboxCell({ user, isCurrentUser, checkboxSpec, projectKey, classes, cellKey, actions, dispatch }) {
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
        checkboxSpec={checkboxSpec}
        projectKey={projectKey}
        classes={classes}
        actions={actions}
        dispatch={dispatch}
      />
    </TableCell>
  );
}

export function PermissionsCheckbox({ user, isCurrentUser, checkboxSpec, projectKey, classes, actions, dispatch }) {
  const props = { checked: true, color: 'default' };
  if (user.role === checkboxSpec.name) {
    props.className = classes.activeSelection;
  } else if (PERMISSION_VALUES[user.role.toUpperCase()] > checkboxSpec.value) {
    props.className = classes.implicitSelection;
  } else {
    props.checked = false;
  }

  if (isCurrentUser) props.disabled = true;

  return <Checkbox {...props} onClick={() => actions.addUserPermission(projectKey, user, checkboxSpec.name, dispatch)}/>;
}

export function RemoveUserButtonCell({ user, isCurrentUser, classes, setRemoveUserDialogState }) {
  return (
    <TableCell className={classes.tableCell} padding="checkbox" align="center">
      <IconButton
        disabled={isCurrentUser}
        onClick={() => {
          setRemoveUserDialogState({ user, open: true });
        }}
      >
        <Icon>{'remove_circle_outline'}</Icon>
      </IconButton>
    </TableCell>
  );
}
