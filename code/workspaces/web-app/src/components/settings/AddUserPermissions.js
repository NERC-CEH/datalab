import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Downshift from 'downshift';
import userActions from '../../actions/userActions';
import projectSettingsActions from '../../actions/projectSettingsActions';

const useStyles = makeStyles(theme => ({
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
    margin: `0 ${theme.spacing(2)}px`,
    minWidth: 95,
  },
  usersAutofill: {
    flexGrow: 1,
  },
}));

const PERMISSIONS = ['Admin', 'User', 'Viewer'];

export const getUsersFromState = ({ users }) => users;

export default function AddUserPermission() {
  const users = useSelector(getUsersFromState);
  const dispatch = useDispatch();
  const [selectedPermissions, setSelectedPermissions] = useState(PERMISSIONS[PERMISSIONS.length - 1]);
  const [selectedUserName, setSelectedUserName] = useState('');

  useEffect(() => {
    dispatch(userActions.listUsers());
  }, [dispatch]);

  return <PureAddUserPermission
    users={users}
    permissionLevels={PERMISSIONS}
    selectedPermissions={selectedPermissions} setSelectedPermissions={setSelectedPermissions}
    selectedUserName={selectedUserName} setSelectedUserName={setSelectedUserName}
    dispatch={dispatch}
  />;
}

export function PureAddUserPermission({
  users, permissionLevels, selectedPermissions, setSelectedPermissions, selectedUserName, setSelectedUserName, dispatch,
}) {
  const classes = useStyles();
  const userNames = users.value.map(user => user.name);

  return (
    <div className={classes.addUserPermission}>
      <UsersAutofill userNames={userNames} setSelectedUserName={setSelectedUserName} />
      <PermissionsSelector
        className={classes.permissionsSelector}
        permissionLevels={permissionLevels}
        selectedPermissions={selectedPermissions}
        setSelectedPermissions={setSelectedPermissions} />
      <AddUserButton
        userInformation={users.value}
        selectedUserName={selectedUserName}
        project="project"
        onClickFn={dispatchAddUserAction}
        dispatch={dispatch}
        selectedPermissions={selectedPermissions} />
    </div>
  );
}

export function UsersAutofill({ userNames, setSelectedUserName }) {
  const classes = useStyles();
  return (
    <Downshift>
      {
        ({
          isOpen,
          inputValue,
          getInputProps,
          getMenuProps,
          getItemProps,
        }) => {
          setSelectedUserName(inputValue);
          return (
            <div className={classes.usersAutofill}>
              <TextField
                label="Add User"
                placeholder="Type user's email..."
                variant="outlined"
                fullWidth
                {...getInputProps()} />
              <UsersDropdown
                userNames={userNames}
                inputValue={inputValue}
                getMenuProps={getMenuProps}
                getItemProps={getItemProps}
                isOpen={isOpen} />
            </div>
          );
        }
      }
    </Downshift>
  );
}

export function UsersDropdown({ userNames, inputValue, getMenuProps, getItemProps, isOpen }) {
  const classes = useStyles();
  const namesMatchingSearch = userNames.filter(name => name.search(inputValue) !== -1);

  const show = isOpen && namesMatchingSearch.length > 0;
  return (
    <Paper
      className={show ? classes.dropDownOpen : classes.dropDownClosed}
      {...getMenuProps()}
    >
      {show
        ? namesMatchingSearch
          .map(userName => <MenuItem {...getItemProps({ item: userName, key: userName })}>{userName}</MenuItem>)
        : null}
    </Paper>
  );
}

export function PermissionsSelector({ permissionLevels, selectedPermissions, setSelectedPermissions }) {
  const classes = useStyles();
  return (
    <TextField
      className={classes.permissionsSelector}
      label="Permissions"
      variant="outlined"
      select
      value={selectedPermissions}
      onChange={event => setSelectedPermissions(event.target.value)}
    >
      {permissionLevels.map(item => <MenuItem value={item} key={item}>{item}</MenuItem>)}
    </TextField>
  );
}

export function AddUserButton({ userInformation, selectedUserName, project, selectedPermissions, onClickFn, dispatch }) {
  const selectedUser = userInformation.find(user => user.name === selectedUserName);
  return (
    <Button
      variant="contained"
      color="primary"
      disabled={!selectedUser}
      onClick={() => onClickFn(project, selectedUser, selectedPermissions, dispatch)}
    >Add</Button>
  );
}

export function dispatchAddUserAction(project, user, selectedPermissions, dispatch) {
  dispatch(
    projectSettingsActions.addUserPermission(
      'project',
      user,
      selectedPermissions.toLowerCase(),
    ),
  );
}
