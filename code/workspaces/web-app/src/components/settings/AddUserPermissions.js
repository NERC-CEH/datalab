import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { startCase } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { Tooltip } from '@material-ui/core';
import userActions from '../../actions/userActions';
import projectSettingsActions from '../../actions/projectSettingsActions';
import { SORTED_PERMISSIONS } from '../../constants/permissions';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import { useCurrentUserId } from '../../hooks/authHooks';
import useCurrentUserSystemAdmin from '../../hooks/useCurrentUserSystemAdmin';
import UserSelect from '../common/input/UserSelect';
import StyledTextField from '../common/input/StyledTextField';

const styles = theme => ({
  addUserPermission: {
    display: 'flex',
    width: '100%',
    margin: 0,
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(1),
  },
  dropDownClosed: {
    display: 'none',
  },
  dropDownOpen: {
    position: 'absolute',
    zIndex: 1,
    overflow: 'auto',
    maxHeight: 400,
  },
  permissionsSelector: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    minWidth: 95,
  },
  usersAutofill: {
    flexGrow: 1,
  },
  addButton: {
    // Styling makes button match size and margins of the outlined text fields
    height: 40,
    marginTop: 8,
    marginBottom: 4,
  },
});

const PERMISSIONS = SORTED_PERMISSIONS.map(item => startCase(item.name));

function AddUserPermission({ classes }) {
  const currentUserId = useCurrentUserId();
  const currentUserSystemAdmin = useCurrentUserSystemAdmin();
  const projectKey = useCurrentProjectKey().value;
  const dispatch = useDispatch();
  const [selectedPermissions, setSelectedPermissions] = useState(PERMISSIONS[PERMISSIONS.length - 1]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(userActions.listUsers());
  }, [dispatch]);

  return <PureAddUserPermission
    currentUserId={currentUserId}
    currentUserSystemAdmin={currentUserSystemAdmin}
    projectKey={projectKey}
    permissionLevels={PERMISSIONS}
    selectedPermissions={selectedPermissions} setSelectedPermissions={setSelectedPermissions}
    selectedUser={selectedUser} setSelectedUser={setSelectedUser}
    dispatch={dispatch}
    classes={classes}
  />;
}

export function PureAddUserPermission({
  currentUserId, currentUserSystemAdmin, projectKey, permissionLevels, selectedPermissions, setSelectedPermissions, selectedUser, setSelectedUser, dispatch, classes,
}) {
  return (
    <div className={classes.addUserPermission}>
      <UserSelect
        className={classes.usersAutofill}
        selectedUsers={selectedUser}
        setSelectedUsers={setSelectedUser}
        label="Add User"
        placeholder="Type user's email..."
      />
      <PermissionsSelector
        className={classes.permissionsSelector}
        permissionLevels={permissionLevels}
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions}
        classes={classes}
      />
      <AddUserButton
        currentUserId={currentUserId}
        currentUserSystemAdmin={currentUserSystemAdmin}
        selectedUser={selectedUser}
        projectKey={projectKey}
        onClickFn={dispatchAddUserAction}
        dispatch={dispatch}
        selectedPermissions={selectedPermissions}
        classes={classes}
      />
    </div>
  );
}

export function PermissionsSelector({ permissionLevels, selectedPermissions, setSelectedPermissions, classes }) {
  return (
    <StyledTextField
      className={classes.permissionsSelector}
      label="Permissions"
      select
      value={selectedPermissions}
      onChange={event => setSelectedPermissions(event.target.value)}
    >
      {permissionLevels.map(item => <MenuItem value={item} key={item}>{item}</MenuItem>)}
    </StyledTextField>
  );
}

export function AddUserButton({ currentUserId, currentUserSystemAdmin, selectedUser, projectKey, selectedPermissions, onClickFn, dispatch, classes }) {
  let disabledMessage = ''; // empty string stops tooltip displaying

  if (!selectedUser) {
    disabledMessage = "Please enter a registered user's email.";
  } else if (selectedUser.userId === currentUserId && !currentUserSystemAdmin) {
    disabledMessage = 'You can not add permissions for yourself.';
  }

  return (
    <Tooltip title={disabledMessage} placement="top">
      <div>
        <PrimaryActionButton
          className={classes.addButton}
          disabled={!!disabledMessage}
          onClick={() => onClickFn(projectKey, selectedUser, selectedPermissions, dispatch)}
        >
          Add
        </PrimaryActionButton>
      </div>
    </Tooltip>
  );
}

export function dispatchAddUserAction(projectKey, user, selectedPermissions, dispatch) {
  dispatch(
    projectSettingsActions.addUserPermission(
      projectKey, user, selectedPermissions.toLowerCase(),
    ),
  );
}

export default withStyles(styles)(AddUserPermission);
