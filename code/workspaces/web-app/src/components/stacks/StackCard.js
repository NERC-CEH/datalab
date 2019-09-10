import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { statusTypes } from 'common';
import StackCardActions from './StackCardActions';
import stackDescriptions from './stackDescriptions';
import StackStatus from './StackStatus';

const { READY } = statusTypes;

function styles(theme) {
  return {
    cardDiv: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      borderTop: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
    },
    imageDiv: {
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
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
    },
    actionsDiv: {
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    statusDiv: {
      display: 'block',
      textAlign: 'center',
      minWidth: 165,
    },
    cardImage: {
      height: 70,
      width: 70,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.spacing(1),
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
      height: 65,
      width: 65,
      borderRadius: theme.spacing(1),
      color: theme.palette.backgroundColor,
      backgroundColor: theme.palette.backgroundDark,
      fontSize: theme.typography.h4.fontSize,
    },
  };
}

const StackCard = ({ classes, stack, openStack, deleteStack, editStack, typeName, userPermissions,
  openPermission, deletePermission, editPermission }) => <div className={classes.cardDiv}>
    <div className={classes.imageDiv}>
      {generateGetImage(classes)(stack)}
    </div>
    <div className={classes.textDiv}>
      <Typography variant="h5" className={classes.displayName}>{getDisplayName(stack)}</Typography>
      <Tooltip title={getDescription(stack, typeName)} placement='bottom-start'>
        <Typography component="p" noWrap>{getDescription(stack, typeName)}</Typography>
      </Tooltip>
    </div>
    <div className={classes.actionsDiv}>
      {typeName !== 'Data Store' && stack.status && <div className={classes.statusDiv}><StackStatus status={stack.status} /></div>}
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
  </div>;

StackCard.propTypes = {
  classes: PropTypes.object.isRequired,
  stack: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    type: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  openStack: PropTypes.func,
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
