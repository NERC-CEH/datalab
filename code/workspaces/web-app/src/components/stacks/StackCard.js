import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
    card: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      borderRadius: 0,
      borderTop: '1px solid',
    },
    cardDiv: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    imageDiv: {
      display: 'inline-block',
    },
    textDiv: {
      display: 'inline-block',
      flexGrow: 1,
      minWidth: 200,
      overflow: 'hidden',
    },
    actionsDiv: {
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    statusDiv: {
      display: 'block',
      textAlign: 'center',
      minWidth: 200,
    },
    cardImage: {
      height: 70,
      width: 120,
    },
    cardIcon: {
      float: 'left',
      fontSize: theme.typography.h2.fontSize,
    },
  };
}

const StackCard = ({ classes, stack, openStack, deleteStack, editStack, typeName, userPermissions,
  openPermission, deletePermission, editPermission }) => <Card className={classes.card}>
    <CardContent>
      <div className={classes.cardDiv}>
        <div className={classes.imageDiv}>
          {generateGetImage(classes)(stack)}
        </div>
        <div className={classes.textDiv}>
          <Typography variant="h5">{getDisplayName(stack)}</Typography>
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
      </div>
    </CardContent>
  </Card>;

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

    if (logoImage) {
      return <img className={classes.cardImage} src={logoImage} alt={stackDescription} />;
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
