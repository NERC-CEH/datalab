import React from 'react';
import PropTypes from 'prop-types';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import PermissionWrapper from '../common/ComponentPermissionWrapper';
import { READY } from '../../../shared/statusTypes';

const StackCardActions = ({ stack, openStack, deleteStack, editStack, userPermissions, openPermission,
  deletePermission, editPermission }) => (
  <CardActions style={{ paddingLeft: 8, paddingRight: 8 }}>
    <PermissionWrapper userPermissions={userPermissions} permission={openPermission}>
      <Button style={{ marginRight: 4 }} color="primary" disabled={!openStack || !isReady(stack)} onClick={() => openStack(stack.id)}>
        Open
      </Button>
    </PermissionWrapper>
    <PermissionWrapper userPermissions={userPermissions} permission={deletePermission}>
      <Button style={{ marginLeft: 4, marginRight: 4 }} color="accent" disabled={!deleteStack || !isReady(stack)} onClick={() => deleteStack(stack)}>
        Delete
      </Button>
    </PermissionWrapper>
    <PermissionWrapper userPermissions={userPermissions} permission={editPermission}>
      <Button style={{ marginLeft: 4 }} color="accent" disabled={!editStack || !isReady(stack)} onClick={() => editStack(stack)}>
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

export default StackCardActions;
