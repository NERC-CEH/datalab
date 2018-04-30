import React from 'react';
import PropTypes from 'prop-types';
import { CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import PermissionWrapper from '../common/ComponentPermissionWrapper';
import { READY } from '../../../shared/statusTypes';

const StackCardActions = ({ stack, openStack, deleteStack, userPermissions, openPermission, deletePermission }) => (
  <CardActions style={{ paddingLeft: 8, paddingRight: 8 }}>
    <PermissionWrapper userPermissions={userPermissions} permission={openPermission}>
      <Button style={{ marginRight: 4 }} color="primary" raised disabled={!openStack || !isReady(stack)} onClick={() => openStack(stack.id)}>
        Open
      </Button>
    </PermissionWrapper>
    <PermissionWrapper userPermissions={userPermissions} permission={deletePermission}>
      <Button style={{ marginLeft: 4 }} color="accent" raised disabled={!deleteStack || !isReady(stack)} onClick={() => deleteStack(stack)}>
        Delete
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
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  openPermission: PropTypes.string.isRequired,
  deletePermission: PropTypes.string.isRequired,
};

const isReady = ({ status }) => status === READY;

export default StackCardActions;
