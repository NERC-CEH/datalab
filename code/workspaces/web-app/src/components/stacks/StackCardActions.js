import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { statusTypes } from 'common';
import PermissionWrapper from '../common/ComponentPermissionWrapper';

const { READY } = statusTypes;

const styles = theme => ({
  cardActions: {
    padding: 0,
    marginTop: theme.spacing(1),
    justifyContent: 'space-between',
  },
  button: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
});

const StackCardActions = ({ stack, openStack, deleteStack, editStack, userPermissions, openPermission,
  deletePermission, editPermission, classes }) => (
  <CardActions className={classes.cardActions}>
    <PermissionWrapper userPermissions={userPermissions} permission={openPermission}>
      <Button
        className={classes.button}
        color="primary"
        disabled={!openStack || !isReady(stack)}
        onClick={() => openStack(stack.id)}
        variant="contained" >
        Open
      </Button>
    </PermissionWrapper>
    <PermissionWrapper userPermissions={userPermissions} permission={deletePermission}>
      <Button
        className={classes.button}
        color="secondary"
        disabled={!deleteStack || !isReady(stack)}
        onClick={() => deleteStack(stack)}
        variant="contained">
        Delete
      </Button>
    </PermissionWrapper>
    <PermissionWrapper userPermissions={userPermissions} permission={editPermission}>
      <Button
        className={classes.button}
        color="secondary"
        disabled={!editStack || !isReady(stack)}
        onClick={() => editStack(stack)}
        variant="contained"
      >
        Edit
      </Button>
    </PermissionWrapper>
  </CardActions>
);

StackCardActions.propTypes = {
  stack: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    type: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  openStack: PropTypes.func,
  deleteStack: PropTypes.func,
  editStack: PropTypes.func,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  openPermission: PropTypes.string.isRequired,
  deletePermission: PropTypes.string.isRequired,
  editPermission: PropTypes.string.isRequired,
};

const isReady = ({ status }) => status === READY;

export default withStyles(styles)(StackCardActions);
