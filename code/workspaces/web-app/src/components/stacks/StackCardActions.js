import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import { statusTypes } from 'common';
import { useCurrentUserId } from '../../hooks/authHooks';
import PermissionWrapper from '../common/ComponentPermissionWrapper';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import SecondaryActionButton from '../common/buttons/SecondaryActionButton';

const { READY } = statusTypes;
const MORE_ICON = 'more_vert';

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
  // Treat user as owner if 'users' not a defined field on stack.
  // This is the case for projects which also use this component. This will mean that
  // projects rely solely on the permissions passed to determine correct rendering.
  const ownsStack = !stack.users || stack.users.includes(currentUserId);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
      {ownsStack && <PermissionWrapper className={classes.buttonWrapper} userPermissions={userPermissions} permission={deletePermission}>
        <SecondaryActionButton
          disabled={!isReady(stack)}
          aria-controls="more-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Icon style={{ color: 'inherit' }}>{MORE_ICON}</Icon>
        </SecondaryActionButton>
      </PermissionWrapper>}
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {editStack && ownsStack && <PermissionWrapper userPermissions={userPermissions} permission={editPermission}>
          <MenuItem
            disabled={!isReady(stack)}
            onClick={() => editStack(stack)}
          >
            Edit
          </MenuItem>
        </PermissionWrapper>}
        {deleteStack && ownsStack && <PermissionWrapper userPermissions={userPermissions} permission={deletePermission}>
          <MenuItem
            disabled={!isReady(stack)}
            onClick={() => deleteStack(stack)}
          >
            Delete
          </MenuItem>
        </PermissionWrapper>}
      </Menu>
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
