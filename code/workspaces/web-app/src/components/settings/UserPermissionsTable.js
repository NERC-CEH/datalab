import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { startCase } from 'lodash';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';
import { useProjectUsers } from '../../hooks/projectUsersHooks';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import { useCurrentUserId } from '../../hooks/authHooks';
import useCurrentUserSystemAdmin from '../../hooks/useCurrentUserSystemAdmin';
import projectSettingsActions from '../../actions/projectSettingsActions';
import RemoveUserDialog from './RemoveUserDialog';
import { CheckboxCell, RemoveUserButtonCell } from './UserPermissionsTableActionCells';
import { SORTED_PERMISSIONS } from '../../constants/permissions';

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

function UserPermissionsTable({ classes }) {
  const users = useProjectUsers();
  const currentUserId = useCurrentUserId();
  const currentUserSystemAdmin = useCurrentUserSystemAdmin();
  const projectKey = useCurrentProjectKey().value;
  const dispatch = useDispatch();

  const [removeUserDialogState, setRemoveUserDialogState] = useState({ open: false, user: null });

  useEffect(
    () => {
      if (projectKey) {
        dispatch(projectSettingsActions.getProjectUserPermissions(projectKey));
      }
    },
    [dispatch, projectKey],
  );

  const actions = {
    removeUserPermission: dispatchRemoveUserPermissions,
    addUserPermission: dispatchAddUserPermissions,
  };

  return (
    <PureUserPermissionsTable
      users={users}
      currentUserId={currentUserId}
      currentUserSystemAdmin={currentUserSystemAdmin}
      projectKey={projectKey}
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
  { users, currentUserId, currentUserSystemAdmin, projectKey, classes, colHeadings, removeUserDialogState,
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
            currentUserSystemAdmin={currentUserSystemAdmin}
            projectKey={projectKey}
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
        projectKey={projectKey}
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

export function UserPermissionsTableBody({ users, currentUserId, currentUserSystemAdmin, projectKey, classes, numCols, setRemoveUserDialogState, actions, dispatch }) {
  if (users.fetching.error || !users.value) {
    return <FullWidthTextRow numCols={numCols}>{'Error fetching data. Please try refreshing the page.'}</FullWidthTextRow>;
  }

  if (users.fetching.inProgress || !projectKey) {
    return <FullWidthRow numCols={numCols}><CircularProgress /></FullWidthRow>;
  }

  if (users.value.length === 0) {
    return <FullWidthTextRow numCols={numCols}>{'No users have project permissions.'}</FullWidthTextRow>;
  }

  return users.value.map((user, index) => (
    <UserPermissionsTableRow
      user={user}
      isCurrentUser={user.userId === currentUserId}
      currentUserSystemAdmin={currentUserSystemAdmin}
      index={index}
      projectKey={projectKey}
      classes={classes}
      setRemoveUserDialogState={setRemoveUserDialogState}
      actions={actions}
      dispatch={dispatch}
      key={`row-${user.userId}`}
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

export function UserPermissionsTableRow({ user, isCurrentUser, currentUserSystemAdmin, index, projectKey, classes, setRemoveUserDialogState, actions, dispatch }) {
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
          currentUserSystemAdmin={currentUserSystemAdmin}
          checkboxSpec={permission}
          projectKey={projectKey}
          classes={classes}
          cellKey={`${rowKey}-${permission.name}`}
          key={`${rowKey}-${permission.name}`}
          actions={actions}
          dispatch={dispatch}/>))
      }
      <RemoveUserButtonCell
        user={user}
        isCurrentUser={isCurrentUser}
        currentUserSystemAdmin={currentUserSystemAdmin}
        classes={classes}
        setRemoveUserDialogState={setRemoveUserDialogState}
      />
    </TableRow>
  );
}

export function dispatchRemoveUserPermissions(projectKey, user, dispatch) {
  dispatch(projectSettingsActions.removeUserPermission(projectKey, user));
}

export function dispatchAddUserPermissions(projectKey, user, role, dispatch) {
  dispatch(projectSettingsActions.addUserPermission(projectKey, user, role));
}

export default withStyles(styles)(UserPermissionsTable);
