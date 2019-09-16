import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { startCase } from 'lodash';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import projectSettingsActions from '../../actions/projectSettingsActions';
import { PERMISSION_VALUES, SORTED_PERMISSIONS } from '../../constants/permissions';

const styles = theme => ({
  activeSelection: {
    color: theme.palette.primary.main,
  },
  implicitSelection: {
    color: theme.palette.primaryTransparent,
  },
  tableHeader: {
    fontWeight: 'bold',
    align: 'center',
  },
  tableCell: {
    '&:first-child': {
      paddingLeft: 0,
    },
    '&:last-child': {
      paddingRight: 0,
    },
  },
  dialogDeleteUserButton: {
    color: theme.palette.dangerColor,
    borderColor: theme.palette.dangerColor,
    '&:hover': {
      background: theme.palette.dangerBackgroundColorLight,
    },
  },
});

export const columnHeadings = [
  { heading: 'User Name', checkBoxCol: false },
].concat(
  SORTED_PERMISSIONS.map(item => ({
    heading: startCase(item.name),
    checkBoxCol: true,
  })),
).concat([{ heading: '', checkBoxCol: true }]); // Gives blank column heading for remove buttons

const checkBoxColumnOrder = SORTED_PERMISSIONS;

export const projectUsersSelector = ({ projectUsers }) => projectUsers;
export const currentUserIdSelector = ({ authentication: { identity: { sub } } }) => sub;

function UserPermissionsTable({ classes }) {
  const users = useSelector(projectUsersSelector, shallowEqual);
  const currentUserId = useSelector(currentUserIdSelector, shallowEqual);
  const dispatch = useDispatch();

  const [removeUserDialogState, setRemoveUserDialogState] = useState({ open: false, user: null });

  useEffect(
    () => {
      dispatch(projectSettingsActions.getProjectUserPermissions('project'));
    },
    [dispatch],
  );

  const actions = {
    removeUserPermission: dispatchRemoveUserPermissions,
    addUserPermission: dispatchAddUserPermissions,
  };

  return (
    <PureUserPermissionsTable
      users={users}
      currentUserId={currentUserId}
      project="project"
      classes={classes}
      colHeadings={columnHeadings}
      removeUserDialogState={removeUserDialogState}
      setRemoveUserDialogState={setRemoveUserDialogState}
      onRemoveUserDialogConfirmationFn={dispatchRemoveUserPermissions}
      actions={actions}
      dispatch={dispatch}
    />
  );
}

export function PureUserPermissionsTable(
  { users, currentUserId, project, classes, colHeadings, removeUserDialogState,
    setRemoveUserDialogState, onRemoveUserDialogConfirmationFn, actions, dispatch },
) {
  return (
    <div>
      <Table>
        <TableHead>
          <UserPermissionsTableHead headings={colHeadings} classes={classes} />
        </TableHead>
        <TableBody>
          <UserPermissionsTableBody
            users={users}
            currentUserId={currentUserId}
            project={project}
            classes={classes}
            numCols={colHeadings.length}
            setRemoveUserDialogState={setRemoveUserDialogState}
            actions={actions}
            dispatch={dispatch}
          />
        </TableBody>
      </Table>
      <RemoveUserDialog
        classes={classes}
        state={removeUserDialogState}
        setState={setRemoveUserDialogState}
        onRemoveConfirmationFn={onRemoveUserDialogConfirmationFn}
        project={project}
        dispatch={dispatch}
      />
    </div>
  );
}

export function UserPermissionsTableHead({ headings, classes }) {
  return (
    <TableRow>
      {headings.map((item, index) => (
        <TableCell
          className={classes.tableCell}
          padding={item.checkBoxCol ? 'checkbox' : null}
          align={item.checkBoxCol ? 'center' : 'left'}
          key={`header-${index}`}
        >
          <Typography className={classes.tableHeader} variant="body1">{item.heading}</Typography>
        </TableCell>
      ))}
    </TableRow>
  );
}

export function UserPermissionsTableBody({ users, currentUserId, project, classes, numCols, setRemoveUserDialogState, actions, dispatch }) {
  if (users.fetching.error || !users.value) {
    return <FullWidthTextRow numCols={numCols}>{'Error fetching data. Please try refreshing the page.'}</FullWidthTextRow>;
  }

  if (users.fetching.inProgress) {
    return <FullWidthRow numCols={numCols}><CircularProgress /></FullWidthRow>;
  }

  if (users.value.length === 0) {
    return <FullWidthTextRow numCols={numCols}>{'No users have project permissions.'}</FullWidthTextRow>;
  }

  return users.value.map((user, index) => (
    <UserPermissionsTableRow
      user={user}
      isCurrentUser={user.userId === currentUserId}
      index={index}
      project={project}
      classes={classes}
      setRemoveUserDialogState={setRemoveUserDialogState}
      actions={actions}
      dispatch={dispatch}
    />));
}

export function FullWidthRow({ children, numCols }) {
  return (
    <TableRow>
      <TableCell colSpan={numCols} align="center">
        {children}
      </TableCell>
    </TableRow>
  );
}

export function FullWidthTextRow({ children, numCols }) {
  return (
    <FullWidthRow numCols={numCols}>
      <Typography variant="body1">{children}</Typography>
    </FullWidthRow>
  );
}

export function UserPermissionsTableRow({ user, isCurrentUser, index, project, classes, setRemoveUserDialogState, actions, dispatch }) {
  const rowKey = `row-${index}`;
  return (
    <TableRow key={rowKey}>
      <TableCell className={classes.tableCell} key={`${rowKey}-username`}>
        <Typography variant="body1">{user.name}</Typography>
      </TableCell>
      {checkBoxColumnOrder.map(permission => (
        <CheckboxCell
          user={user}
          isCurrentUser={isCurrentUser}
          checkboxSpec={permission}
          project={project}
          classes={classes}
          cellKey={`${rowKey}-${permission.name}`}
          key={`${rowKey}-${permission.name}`}
          actions={actions}
          dispatch={dispatch}/>))
      }
      <RemoveUserButtonCell
        user={user}
        isCurrentUser={isCurrentUser}
        classes={classes}
        setRemoveUserDialogState={setRemoveUserDialogState}
      />
    </TableRow>
  );
}

export function CheckboxCell({ user, isCurrentUser, checkboxSpec, project, classes, cellKey, actions, dispatch }) {
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
        project={project}
        classes={classes}
        actions={actions}
        dispatch={dispatch}
      />
    </TableCell>
  );
}

export function PermissionsCheckbox({ user, isCurrentUser, checkboxSpec, project, classes, actions, dispatch }) {
  const props = { checked: true, color: 'default' };
  if (user.role === checkboxSpec.name) {
    props.className = classes.activeSelection;
  } else if (PERMISSION_VALUES[user.role.toUpperCase()] > checkboxSpec.value) {
    props.className = classes.implicitSelection;
  } else {
    props.checked = false;
  }

  if (isCurrentUser) props.disabled = true;

  return <Checkbox {...props} onClick={() => actions.addUserPermission(project, user, checkboxSpec.name, dispatch)}/>;
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

export function RemoveUserDialog({ classes, state, setState, onRemoveConfirmationFn, project, dispatch }) {
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

export function dispatchRemoveUserPermissions(projectKey, user, dispatch) {
  dispatch(projectSettingsActions.removeUserPermission(projectKey, user));
}

export function dispatchAddUserPermissions(projectKey, user, role, dispatch) {
  dispatch(projectSettingsActions.addUserPermission(projectKey, user, role));
}

export default withStyles(styles)(UserPermissionsTable);
