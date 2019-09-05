import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import projectSettingsActions from '../../actions/projectSettingsActions';

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
});

export const PERMISSIONS = {
  ADMIN: {
    name: 'ADMIN',
    value: 10,
  },
  USER: {
    name: 'USER',
    value: 5,
  },
  VIEWER: {
    name: 'VIEWER',
    value: 1,
  },
};

export const columnHeadings = [
  { heading: 'User Name', checkBoxCol: false },
  { heading: 'Admin', checkBoxCol: true },
  { heading: 'User', checkBoxCol: true },
  { heading: 'Viewer', checkBoxCol: true },
];

const checkBoxColumnOrder = [PERMISSIONS.ADMIN, PERMISSIONS.USER, PERMISSIONS.VIEWER];

export const projectUsersSelector = ({ projectUsers }) => projectUsers;

function UserPermissionsTable({ classes }) {
  const users = useSelector(projectUsersSelector);
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(projectSettingsActions.getProjectUserPermissions('project'));
    },
    [dispatch],
  );

  return (
    getTable(users, classes, columnHeadings)
  );
}

export function getTable(users, classes, colHeadings) {
  return (
    <Table size="small">
      <TableHead>
        {getTableHead(columnHeadings, classes)}
      </TableHead>
      <TableBody>
        {getTableBody(users, classes, colHeadings.length)}
      </TableBody>
    </Table>
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

export function getTableBody(users, classes, numCols) {
  if (users.error || !users.value) {
    return getFullWidthTextRow(
      'Error fetching data. Please try refreshing the page.',
      numCols,
    );
  }

  if (users.fetching) {
    return getFullWidthRow(<CircularProgress />, numCols);
  }

  if (users.value.length === 0) {
    return getFullWidthTextRow('No users have project permissions.', numCols);
  }

  return users.value.map((user, index) => getTableRow(user, index, classes));
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

export function getTableRow(user, index, classes) {
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
  const roleName = userRole.toUpperCase();
  if (roleName === checkbox.name) {
    return (
      <Checkbox className={classes.activeSelection} checked={true} color="default" />
    );
  }
  if (PERMISSIONS[roleName].value > checkbox.value) {
    return (
      <Checkbox className={classes.implicitSelection} checked={true} color="default" />
    );
  }
  return <Checkbox checked={false}/>;
}

export default withStyles(styles)(UserPermissionsTable);
