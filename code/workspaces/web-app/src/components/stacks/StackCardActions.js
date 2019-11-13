import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { statusTypes } from 'common';
import { useCurrentUserId } from '../../hooks/authHooks';
import PermissionWrapper from '../common/ComponentPermissionWrapper';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import SecondaryActionButton from '../common/buttons/SecondaryActionButton';

const { READY } = statusTypes;

const styles = theme => ({
  cardActions: {
    display: 'flex',
    width: '100%',
  },
  buttonWrapper: {
    flexGrow: '1',
    '& + &': {
      marginLeft: theme.spacing(1),
    },
  },
});

const StackCardActions = (props) => {
  const currentUserId = useCurrentUserId();
  return <PureStackCardActions currentUserId={currentUserId} {...props} />;
};

export const PureStackCardActions = ({ stack, openStack, deleteStack, editStack, userPermissions, openPermission,
  deletePermission, editPermission, currentUserId, classes }) => {
  const ownsNotebook = stack.users.includes(currentUserId);

  return (
    <div className={classes.cardActions}>
      {openStack && <PermissionWrapper className={classes.buttonWrapper} userPermissions={userPermissions} permission={openPermission}>
        <PrimaryActionButton
          disabled={!isReady(stack)}
          onClick={() => openStack(stack)}
          fullWidth
        >
          Open
        </PrimaryActionButton>
      </PermissionWrapper>}
      {deleteStack && ownsNotebook && <PermissionWrapper className={classes.buttonWrapper} userPermissions={userPermissions} permission={deletePermission}>
        <SecondaryActionButton
          disabled={!isReady(stack)}
          onClick={() => deleteStack(stack)}
          fullWidth
        >
          Delete
        </SecondaryActionButton>
      </PermissionWrapper>}
      {editStack && ownsNotebook && <PermissionWrapper className={classes.buttonWrapper} userPermissions={userPermissions} permission={editPermission}>
        <SecondaryActionButton
          disabled={!isReady(stack)}
          onClick={() => editStack(stack)}
          fullWidth
        >
          Edit
        </SecondaryActionButton>
      </PermissionWrapper>}
    </div>
  );
};

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
