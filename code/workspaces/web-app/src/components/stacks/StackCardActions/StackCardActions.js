// @ts-nocheck
import withStyles from '@mui/styles/withStyles';
import Menu from '@mui/material/Menu';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { statusTypes, visibilityTypes } from 'common';
import { SYSTEM_INSTANCE_ADMIN } from 'common/src/permissionTypes';
import { SITE_CATEGORY } from 'common/src/config/images';
import { useCurrentUserId } from '../../../hooks/authHooks';
import PermissionWrapper from '../../common/ComponentPermissionWrapper';
import PrimaryActionButton from '../../common/buttons/PrimaryActionButton';
import SecondaryActionButton from '../../common/buttons/SecondaryActionButton';
import StackMoreMenuItem from './StackMoreMenuItem';
import { getUserActionsForType } from '../../../config/images';

const { READY, SUSPENDED } = statusTypes;
const { PRIVATE, PROJECT, PUBLIC } = visibilityTypes;
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

  return <PureStackCardActions
    currentUserId={currentUserId}
    userActions={getUserActionsForType(stack.type)}
    {...props}
  />;
};

const getShareButton = (stack, shareStack, permission) => (newStatus, label, disabled) => ({
  onClick: () => shareStack(stack, newStatus),
  requiredPermission: permission,
  name: label,
  disabled,
  tooltipText: `Access already set to ${newStatus}`,
  disableTooltip: !disabled,
});

export const getSharedButtons = (stack, shareStack, permission) => {
  // Function to get the different "Share" buttons available to the stack
  const isSite = stack.category === SITE_CATEGORY;
  const shareButton = getShareButton(stack, shareStack, permission);

  const shared = stack.shared || stack.visible;

  return [
    isSite ? shareButton(PRIVATE, 'Set Access: Private', shared === PRIVATE) : undefined,
    shareButton(PROJECT, 'Set Access: Project', shared === PROJECT),
    isSite ? shareButton(PUBLIC, 'Set Access: Public', shared === PUBLIC) : undefined,
  ];
};

export const PureStackCardActions = ({ stack, openStack, deleteStack, editStack, restartStack, scaleStack, copySnippets, userActions,
  userPermissions, openPermission, deletePermission, editPermission, scalePermission, currentUserId, classes, getLogs, shareStack }) => {
  // Treat user as owner if 'users' not a defined field on stack.
  // This is the case for projects which also use this component. This will mean that
  // projects rely solely on the permissions passed to determine correct rendering.
  const ownsStack = !stack.users || stack.users.includes(currentUserId);
  const isInstanceAdmin = userPermissions.includes(SYSTEM_INSTANCE_ADMIN);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMoreButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMoreMenuClose = () => {
    setAnchorEl(null);
  };

  const OpenButton = React.forwardRef((props, ref) => <PrimaryActionButton ref={ref} {...props} />);

  const shouldRenderLogs = userActions.logs && getLogs !== undefined;
  const shouldRenderEdit = userActions.edit && editStack !== undefined;
  const shouldRenderShare = userActions.share && shareStack !== undefined;
  const shouldRenderRestart = userActions.restart && restartStack !== undefined;
  const shouldRenderScale = userActions.scale && scaleStack !== undefined;
  const shouldRenderDelete = userActions.delete && deleteStack !== undefined;
  const shouldRenderCopySnippet = userActions.copySnippets && copySnippets !== undefined;

  const copySnippetMenuItems = shouldRenderCopySnippet ? Object.keys(copySnippets).map(k => ({
    onClick: () => { handleMoreMenuClose(); copySnippets[k](stack); },
    requiredPermission: openPermission,
    name: `Copy ${k} snippet`,
  })) : [];

  const shareMenuItems = shouldRenderShare ? getSharedButtons(stack, shareStack, deletePermission) : [];
  const scaleOption = stack.status === SUSPENDED ? 1 : 0;

  const stackMenuItems = [
    shouldRenderLogs && { onClick: () => getLogs(stack), requiredPermission: deletePermission, name: 'Logs' },
    shouldRenderEdit && { onClick: () => editStack(stack), requiredPermission: editPermission, name: 'Edit' },
    ...shareMenuItems,
    shouldRenderRestart && {
      onClick: () => restartStack(stack),
      requiredPermission: editPermission,
      name: 'Restart',
      disabled: stack.status === SUSPENDED,
    },
    shouldRenderScale && {
      onClick: () => scaleStack(stack, scaleOption),
      requiredPermission: scalePermission,
      name: stack.status === SUSPENDED ? 'Turn On' : 'Suspend',
    },
    ...copySnippetMenuItems,
    shouldRenderDelete && {
      onClick: () => deleteStack(stack),
      requiredPermission: deletePermission,
      name: 'Delete',
    },
  ].filter(m => !!m);

  const shouldRenderMenuItems = (ownsStack || isInstanceAdmin) && stackMenuItems.length > 0;

  return (
    <div className={classes.cardActions}>
      {openStack && <PermissionWrapper className={classes.buttonWrapper} userPermissions={userPermissions} permission={openPermission}>
        <Tooltip
          title='Cannot be opened until resource is ready' placement='bottom-start'
          disableHoverListener={isReady(stack)}
        >
          <div>
            {stack.status !== SUSPENDED
            && <OpenButton
              disabled={!isReady(stack)}
              onClick={() => openStack(stack)}
              fullWidth
            >
              Open
            </OpenButton>
            }
            {stack.status === SUSPENDED
            && <SecondaryActionButton
              onClick={() => scaleStack(stack, scaleOption)}
              fullWidth
            >
              Turn On
            </SecondaryActionButton>
            }
          </div>
        </Tooltip>
      </PermissionWrapper>}
      {shouldRenderMenuItems && <PermissionWrapper className={classes.buttonWrapper} userPermissions={userPermissions} permission={deletePermission}>
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
        {stackMenuItems.map(m => (<StackMoreMenuItem
            shouldRender={true}
            userPermissions={userPermissions}
            {...m}
            key={m.name}
          >
            {m.name}
          </StackMoreMenuItem>))}
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
    category: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  openStack: PropTypes.func,
  deleteStack: PropTypes.func,
  editStack: PropTypes.func,
  restartStack: PropTypes.func,
  scaleStack: PropTypes.func,
  getLogs: PropTypes.func,
  shareStack: PropTypes.func,
  copySnippets: PropTypes.objectOf(PropTypes.func),
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  openPermission: PropTypes.string,
  deletePermission: PropTypes.string,
  editPermission: PropTypes.string,
  scalePermission: PropTypes.string,
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
    copySnippets: PropTypes.bool,
  }).isRequired,
};

const isReady = ({ status }) => status === READY;

export default withStyles(styles)(StackCardActions);
