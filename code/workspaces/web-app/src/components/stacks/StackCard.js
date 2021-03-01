import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ResourceInfoSpan from '../common/typography/ResourceInfoSpan';
import StackCardActions from './StackCardActions/StackCardActions';
import stackDescriptions from './stackDescriptions';
import StackStatus from './StackStatus';
import { useUsers } from '../../hooks/usersHooks';
import { storageDescription, storageDisplayValue } from '../../config/storage';
import { NOTEBOOK_TYPE_NAME } from '../../containers/notebooks/notebookTypeName';
import { PROJECT_TYPE_NAME } from '../../containers/projects/projectTypeName';
import { SITE_TYPE_NAME } from '../../containers/sites/siteTypeName';
import { STORAGE_TYPE_NAME } from '../../containers/dataStorage/storageTypeName';

function styles(theme) {
  return {
    cardDiv: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      borderTop: `1px solid ${theme.palette.divider}`,
      padding: `${theme.spacing(3)}px 0`,
      '&:last-child': {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
    imageDiv: {
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    textDiv: {
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'center',
      flexGrow: 1,
      minWidth: 200,
      overflow: 'hidden',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    displayName: {
      marginTop: 0,
      marginBottom: 0,
      marginRight: theme.spacing(3),
    },
    displayNameContainer: {
      display: 'inline-flex',
      alignItems: 'baseline',
    },
    actionsDiv: {
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    statusDiv: {
      display: 'block',
      textAlign: 'center',
      minWidth: 150,
    },
    cardImage: {
      height: theme.cardImageSize + theme.spacing(1),
      width: theme.cardImageSize + theme.spacing(1),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
    },
    cardIcon: {
      float: 'left',
      fontSize: theme.typography.h2.fontSize,
    },
    cardInitial: {
      flexDirection: 'column',
      justifyContent: 'center',
      display: 'inline-flex',
      textAlign: 'center',
      height: theme.cardImageSize,
      width: theme.cardImageSize,
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.backgroundColor,
      backgroundColor: theme.palette.backgroundDark,
      fontSize: theme.typography.h4.fontSize,
    },
    shareStatus: {
      color: theme.typography.colorLight,
    },
  };
}

const StackCard = ({ classes, stack, openStack, deleteStack, editStack, restartStack, typeName,
  userPermissions, openPermission, deletePermission, editPermission, getLogs, shareStack }) => {
  const users = useUsers();
  const storeDisplayValue = (typeName === STORAGE_TYPE_NAME && stack.type) ? storageDisplayValue(stack.type) : '';
  const description = getDescription(stack, typeName);

  const ResourceInfo = () => {
    if (typeName === NOTEBOOK_TYPE_NAME || typeName === SITE_TYPE_NAME) {
      return stack.version ? (<ResourceInfoSpan>({stack.version})</ResourceInfoSpan>) : null;
    } if (typeName === PROJECT_TYPE_NAME) {
      return stack.key ? (<ResourceInfoSpan>({stack.key})</ResourceInfoSpan>) : null;
    } if (typeName === STORAGE_TYPE_NAME) {
      return storeDisplayValue ? (<ResourceInfoSpan>({storeDisplayValue})</ResourceInfoSpan>) : null;
    }
    return null;
  };

  return (
    <div className={classes.cardDiv}>
      <div className={classes.imageDiv}>
        {generateGetImage(classes, typeName)(stack)}
      </div>
      <div className={classes.textDiv}>
        <div className={classes.displayNameContainer}>
          <Typography variant="h5" className={classes.displayName} noWrap>{getDisplayName(stack)}</Typography>
          <ResourceInfo/>
        </div>
        <Tooltip title={description} placement='bottom-start'>
          <Typography variant="body1" noWrap>{description}</Typography>
        </Tooltip>
        {renderShareInfo(typeName, stack) && <Typography variant="body1" className={classes.shareStatus}>Shared by {getUserEmail(stack.users, users)}</Typography>}
      </div>
      <div className={classes.actionsDiv}>
        {typeName !== STORAGE_TYPE_NAME && typeName !== PROJECT_TYPE_NAME && stack.status && <div className={classes.statusDiv}><StackStatus status={stack.status}/></div>}
        <StackCardActions
            stack={stack}
            openStack={openStack}
            deleteStack={deleteStack}
            editStack={editStack}
            restartStack={restartStack}
            getLogs={getLogs}
            userPermissions={userPermissions}
            openPermission={openPermission}
            deletePermission={deletePermission}
            shareStack={shareStack}
            editPermission={editPermission}
          />
      </div>
    </div>
  );
};

StackCard.propTypes = {
  classes: PropTypes.object.isRequired,
  stack: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    type: PropTypes.string,
    status: PropTypes.string,
    users: PropTypes.arrayOf(PropTypes.string),
    shared: PropTypes.string,
    visible: PropTypes.string,
  }).isRequired,
  openStack: PropTypes.func,
  openHref: PropTypes.string,
  deleteStack: PropTypes.func,
  getLogs: PropTypes.func,
  editStack: PropTypes.func,
  restartStack: PropTypes.func,
  shareStack: PropTypes.func,
  typeName: PropTypes.string.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  openPermission: PropTypes.string.isRequired,
  deletePermission: PropTypes.string.isRequired,
  editPermission: PropTypes.string.isRequired,
};

function getDisplayName(stack) {
  return stack.displayName || 'Display Name';
}

const renderShareInfo = (typeName, stack) => stack.users
    && stack.users.length !== 0
    && (typeName === NOTEBOOK_TYPE_NAME || typeName === SITE_TYPE_NAME)
    && (stack.shared === 'project' || stack.visible === 'project' || stack.visible === 'public');

function getUserEmail(stackUsers, userList, typeName) {
  const owner = userList.value.find(user => user.userId === stackUsers[0]);
  return owner ? owner.name : 'Unknown';
}

function generateGetImage(classes, typeName) {
  function getImage(stack) {
    const stackDescription = stack.type && stackDescriptions[stack.type];
    const logoImage = stackDescription && stackDescription.logo;
    const iconName = (typeName === STORAGE_TYPE_NAME) ? 'save' : stackDescription && stackDescription.icon;
    const initial = stackDescription && stackDescription.initial && getDisplayName(stack).charAt(0);

    if (logoImage) {
      return <img className={classes.cardImage} src={logoImage} alt={`${stack.type} logo`} />;
    }

    if (initial) {
      return <div className={classes.cardInitial}>{initial}</div>;
    }

    return <Icon className={classes.cardIcon} children={iconName || 'create'} />;
  }

  return getImage;
}

function getDescription(stack, typeName) {
  if (stack.description) {
    return stack.description;
  } if (typeName === STORAGE_TYPE_NAME && stack.type) {
    return storageDescription(stack.type);
  } if (stackDescriptions[stack.type]) {
    return stackDescriptions[stack.type].description;
  }
  return `A description of the ${typeName} purpose`;
}

export default withStyles(styles)(StackCard);
