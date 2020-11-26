import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { statusTypes } from 'common';
import { useCurrentUserId } from '../../../hooks/authHooks';
import PermissionWrapper from '../../common/ComponentPermissionWrapper';
import PrimaryActionButton from '../../common/buttons/PrimaryActionButton';
import SecondaryActionButton from '../../common/buttons/SecondaryActionButton';
import StackMoreMenuItem from './StackMoreMenuItem';
import { getUserActionsForType } from '../../../config/images';

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
  const { stack } = props;

  const currentUserId = useCurrentUserId();

  const [userActions, setUserActions] = useState({});
  useEffect(() => {
    const getUserActions = async () => {
      setUserActions(await getUserActionsForType(stack.type));
    };
    getUserActions();
  }, [stack.type]);

  return <PureStackCardActions
    currentUserId={currentUserId}
    userActions={userActions}
    {...props}
  />;
};

export const PureStackCardActions = ({ stack, openStack, deleteStack, editStack, restartStack, userActions,
  userPermissions, openPermission, deletePermission, editPermission, currentUserId, classes, getLogs, shareStack }) => {
  // Treat user as owner if 'users' not a defined field on stack.
  // This is the case for projects which also use this component. This will mean that
  // projects rely solely on the permissions passed to determine correct rendering.
  const ownsStack = !stack.users || stack.users.includes(currentUserId);
  const [anchorEl, setAnchorEl] = useState(null);
  const shared = ['project'].includes(stack.shared) || ['project', 'public'].includes(stack.visible);

  const handleMoreButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMoreMenuClose = () => {
    setAnchorEl(null);
  };

  const OpenButton = React.forwardRef((props, ref) => <PrimaryActionButton innerRef={ref} {...props} />);

  const shouldRenderLogs = userActions.logs && getLogs !== undefined;
  const shouldRenderEdit = userActions.edit && editStack !== undefined;
  const shouldRenderShare = userActions.share && shareStack !== undefined;
  const shouldRenderRestart = userActions.restart && restartStack !== undefined;
  const shouldRenderDelete = userActions.delete && deleteStack !== undefined;
  const shouldRenderMenuItems = shouldRenderLogs
    || shouldRenderEdit
    || shouldRenderShare
    || shouldRenderRestart
    || shouldRenderDelete;

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
      {ownsStack && stack.status && shouldRenderMenuItems && <PermissionWrapper className={classes.buttonWrapper} userPermissions={userPermissions} permission={deletePermission}>
        <SecondaryActionButton
          aria-controls="more-menu"
          aria-haspopup="true"
          onClick={handleMoreButtonClick}
          fullWidth
        >
          <Icon style={{ color: 'inherit' }}>{MORE_ICON}</Icon>
        </SecondaryActionButton>
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMoreMenuClose}
      >
        <StackMoreMenuItem
          shouldRender={shouldRenderLogs}
          onClick={() => getLogs(stack)}
          userPermissions={userPermissions}
          requiredPermission={deletePermission}
        >
          Logs
        </StackMoreMenuItem>
        <StackMoreMenuItem
          shouldRender={shouldRenderEdit}
          onClick={() => editStack(stack)}
          userPermissions={userPermissions}
          requiredPermission={editPermission}
        >
          Edit
        </StackMoreMenuItem>
        <StackMoreMenuItem
          shouldRender={shouldRenderShare}
          onClick={() => shareStack(stack, 'project')}
          userPermissions={userPermissions}
          requiredPermission={deletePermission}
          tooltipText="Resource is already shared within the project"
          disableTooltip={!shared}
          disabled={shared}
        >
          Share
        </StackMoreMenuItem>
        <StackMoreMenuItem
          shouldRender={shouldRenderRestart}
          onClick={() => restartStack(stack)}
          userPermissions={userPermissions}
          requiredPermission={editPermission}
        >
          Restart
        </StackMoreMenuItem>
        <StackMoreMenuItem
          shouldRender={shouldRenderDelete}
          onClick={() => deleteStack(stack)}
          userPermissions={userPermissions}
          requiredPermission={deletePermission}
        >
          Delete
        </StackMoreMenuItem>
      </Menu>
      </PermissionWrapper>}
    </div>
  );
};

const sharedPropTypes = {
  stack: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    type: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  openStack: PropTypes.func,
  deleteStack: PropTypes.func,
  editStack: PropTypes.func,
  restartStack: PropTypes.func,
  getLogs: PropTypes.func,
  shareStack: PropTypes.func,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  openPermission: PropTypes.string.isRequired,
  deletePermission: PropTypes.string.isRequired,
  editPermission: PropTypes.string.isRequired,
};

StackCardActions.propTypes = sharedPropTypes;
PureStackCardActions.propTypes = {
  ...sharedPropTypes,
  currentUserId: PropTypes.string.isRequired,
  userActions: PropTypes.shape({
    share: PropTypes.bool,
    edit: PropTypes.bool,
    restart: PropTypes.bool,
    delete: PropTypes.bool,
    logs: PropTypes.bool,
  }).isRequired,
};

const isReady = ({ status }) => status === READY;

export default withStyles(styles)(StackCardActions);
