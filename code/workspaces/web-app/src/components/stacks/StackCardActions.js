import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
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
  deletePermission, editPermission, currentUserId, classes, getLogs, shareStack }) => {
  // Treat user as owner if 'users' not a defined field on stack.
  // This is the case for projects which also use this component. This will mean that
  // projects rely solely on the permissions passed to determine correct rendering.
  const ownsStack = !stack.users || stack.users.includes(currentUserId);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const shared = ['project'].includes(stack.shared) || ['project', 'public'].includes(stack.visible);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const OpenButton = React.forwardRef((props, ref) => <PrimaryActionButton innerRef={ref} {...props} />);

  return (
    <div className={classes.cardActions}>
      {openStack && <PermissionWrapper className={classes.buttonWrapper} userPermissions={userPermissions} permission={openPermission}>
        <Tooltip
          title='Cannot be opened until resource is ready' placement='bottom-start'
          disableHoverListener={isReady(stack)}
        >
          <div>
            <OpenButton
              disabled={!isReady(stack)}
              onClick={() => openStack(stack)}
              fullWidth
            >
              Open
            </OpenButton>
          </div>
        </Tooltip>
      </PermissionWrapper>}
      {ownsStack && stack.status && <PermissionWrapper className={classes.buttonWrapper} userPermissions={userPermissions} permission={deletePermission}>
        <SecondaryActionButton
          aria-controls="more-menu"
          aria-haspopup="true"
          onClick={handleClick}
          fullWidth
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
        {stack.type === 'rshiny' && <PermissionWrapper userPermissions={userPermissions} permission={deletePermission}>
          <MenuItem onClick={() => getLogs(stack)}>
            Logs
          </MenuItem>
        </PermissionWrapper>}
        {editStack && ownsStack && <PermissionWrapper userPermissions={userPermissions} permission={editPermission}>
          <MenuItem onClick={() => editStack(stack)}>
            Edit
          </MenuItem>
        </PermissionWrapper>}
        {(stack.type === 'rstudio' || stack.type === 'jupyterlab' || stack.type === 'jupyter' || stack.type === 'nbviewer' || stack.type === 'rshiny'
          || stack.type === 'zeppelin') && deleteStack && ownsStack && <PermissionWrapper userPermissions={userPermissions} permission={deletePermission}>
          <MenuItem disabled={shared} onClick={() => shareStack(stack, 'project')}>
            Share
          </MenuItem>
        </PermissionWrapper>}
        {deleteStack && ownsStack && <PermissionWrapper userPermissions={userPermissions} permission={deletePermission}>
          <MenuItem onClick={() => deleteStack(stack)}>
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
  getLogs: PropTypes.func,
  shareStack: PropTypes.func,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  openPermission: PropTypes.string.isRequired,
  deletePermission: PropTypes.string.isRequired,
  editPermission: PropTypes.string.isRequired,
};

const isReady = ({ status }) => status === READY;

export default withStyles(styles)(StackCardActions);
