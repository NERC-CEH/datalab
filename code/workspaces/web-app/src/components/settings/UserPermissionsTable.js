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

function UserPermissionsTable({ classes }) {
  const users = useSelector(
    projectUsersSelector,
    shallowEqual,
  );
  const dispatch = useDispatch();

  const [removeUserDialogState, setRemoveUserDialogState] = useState({ open: false, user: null });

  useEffect(
    () => {
      dispatch(projectSettingsActions.getProjectUserPermissions('project'));
    },
    [dispatch],
  );

  return (
    <PureUserPermissionsTable
      users={users}
      classes={classes}
      colHeadings={columnHeadings}
      removeUserDialogState={removeUserDialogState}
      setRemoveUserDialogState={setRemoveUserDialogState}
      onRemoveUserDialogConfirmationFn={dispatchRemoveUserPermissions}
      dispatch={dispatch}
    />
  );
}

export function PureUserPermissionsTable({ users, classes, colHeadings, removeUserDialogState, setRemoveUserDialogState, onRemoveUserDialogConfirmationFn, dispatch }) {
  return (
    <div>
      <Table>
        <TableHead>
          {getTableHead(columnHeadings, classes)}
        </TableHead>
        <TableBody>
          {getTableBody(users, classes, colHeadings.length, setRemoveUserDialogState)}
        </TableBody>
      </Table>
      <RemoveUserDialog
        classes={classes}
        state={removeUserDialogState}
        setState={setRemoveUserDialogState}
        onRemoveConfirmationFn={onRemoveUserDialogConfirmationFn}
        project="project"
        dispatch={dispatch}
      />
    </div>
  );
}

export function getTableHead(headings, classes) {
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

export function getTableBody(users, classes, numCols, setRemoveUserDialogState) {
  if (users.fetching.error || !users.value) {
    return getFullWidthTextRow(
      'Error fetching data. Please try refreshing the page.',
      numCols,
    );
  }

  if (users.fetching.inProgress) {
    return getFullWidthRow(<CircularProgress />, numCols);
  }

  if (users.value.length === 0) {
    return getFullWidthTextRow('No users have project permissions.', numCols);
  }

  return users.value.map((user, index) => getTableRow(user, index, classes, setRemoveUserDialogState));
}

export function getFullWidthRow(content, numCols) {
  return (
    <TableRow>
      <TableCell colSpan={numCols} align="center">
        {content}
      </TableCell>
    </TableRow>
  );
}

export function getFullWidthTextRow(text, numCols) {
  return getFullWidthRow(
    <Typography variant="body1">{text}</Typography>,
    numCols,
  );
}

export function getTableRow(user, index, classes, setRemoveUserDialogState) {
  const rowKey = `row-${index}`;
  return (
    <TableRow key={rowKey}>
      <TableCell className={classes.tableCell} key={`${rowKey}-USERNAME`}>
        <Typography variant="body1">{user.name}</Typography>
      </TableCell>
      {checkBoxColumnOrder.map(
        permission => getCheckboxCell(
          user.role,
          permission,
          classes,
          `${rowKey}-${permission.name}`,
        ),
      )}
      {getRemoveUserButtonCell(user, classes, setRemoveUserDialogState)}
    </TableRow>
  );
}

export function getCheckboxCell(userRole, checkbox, classes, key) {
  return (
    <TableCell
      className={classes.tableCell}
      padding="checkbox"
      align="center"
      key={key}
    >
      {getCheckbox(userRole, checkbox, classes)}
    </TableCell>
  );
}

export function getCheckbox(userRole, checkbox, classes) {
  if (userRole === checkbox.name) {
    return (
      <Checkbox className={classes.activeSelection} checked={true} color="default" />
    );
  }
  if (PERMISSION_VALUES[userRole.toUpperCase()] > checkbox.value) {
    return (
      <Checkbox className={classes.implicitSelection} checked={true} color="default" />
    );
  }
  return <Checkbox checked={false}/>;
}

export function getRemoveUserButtonCell(user, classes, setRemoveUserDialogState) {
  return (
    <TableCell className={classes.tableCell} padding="checkbox" align="center">
      <IconButton onClick={() => {
        setRemoveUserDialogState({ user, open: true });
      }}>
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

export default withStyles(styles)(UserPermissionsTable);
