import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { statusTypes } from 'common';
import ProjectKey from '../common/typography/ProjectKey';
import StackCardActions from './StackCardActions';
import stackDescriptions from './stackDescriptions';
import StackStatus from './StackStatus';
import { useUsers } from '../../hooks/usersHooks';

const { READY } = statusTypes;

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
    //  fontSize: theme.typography.body2.fontSize,
    },
  };
}

const StackCard = ({ classes, stack, openStack, deleteStack, editStack, typeName, userPermissions,
  openPermission, deletePermission, editPermission }) => {
  const users = useUsers();

  return (
    <div className={classes.cardDiv}>
      <div className={classes.imageDiv}>
        {generateGetImage(classes)(stack)}
      </div>
      <div className={classes.textDiv}>
        <div className={classes.displayNameContainer}>
          <Typography variant="h5" className={classes.displayName} noWrap>{getDisplayName(stack)}</Typography>
          {typeName === 'Project' ? <ProjectKey>({stack.key})</ProjectKey> : null}
        </div>
        <Tooltip title={getDescription(stack, typeName)} placement='bottom-start'>
          <Typography varient="body1" noWrap>{getDescription(stack, typeName)}</Typography>
        </Tooltip>
        {renderShareInfo(typeName, stack) && <Typography variant="body1" className={classes.shareStatus}>Shared by {getUserEmail(stack.users, users)}</Typography>}
      </div>
      <div className={classes.actionsDiv}>
        {typeName !== 'Data Store' && typeName !== 'Project' && stack.status && <div className={classes.statusDiv}><StackStatus status={stack.status}/></div>}
        {stack.status === READY
          && <StackCardActions
            stack={stack}
            openStack={openStack}
            deleteStack={deleteStack}
            editStack={editStack}
            userPermissions={userPermissions}
            openPermission={openPermission}
            deletePermission={deletePermission}
            editPermission={editPermission}
          />}
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
  editStack: PropTypes.func,
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
    && (typeName === 'Notebook' || typeName === 'Site')
    && (stack.shared === 'project' || stack.visible === 'project' || stack.visible === 'public');

function getUserEmail(stackUsers, userList, typeName) {
  const owner = userList.value.find(user => user.userId === stackUsers[0]);
  return owner ? owner.name : 'Unknown';
}

function generateGetImage(classes) {
  function getImage(stack) {
    const stackDescription = stack.type && stackDescriptions[stack.type];
    const logoImage = stackDescription && stackDescription.logo;
    const iconName = stackDescription && stackDescription.icon;
    const initial = stackDescription && stackDescription.initial && getDisplayName(stack).charAt(0);

    if (logoImage) {
      return <img className={classes.cardImage} src={logoImage} alt={stackDescription} />;
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
  } if (stackDescriptions[stack.type]) {
    return stackDescriptions[stack.type].description;
  }
  return `A description of the ${typeName} purpose`;
}

export default withStyles(styles)(StackCard);
