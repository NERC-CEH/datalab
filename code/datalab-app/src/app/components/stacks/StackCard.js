import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import { capitalize } from 'lodash';
import stackDescriptions from './stackDescriptions';
import StackCardActions from './StackCardActions';
import StackStatus from './StackStatus';
import { READY } from '../../../shared/statusTypes';

function styles(theme) {
  const flexProps = {
    display: 'flex',
    justifyContent: 'space-between',
  };

  return {
    card: {
      ...flexProps,
      flexDirection: 'column',
      height: '100%',
      minHeight: 230,
    },
    cardHeader: {
      ...flexProps,
    },
    cardMedia: {
      height: 70,
      width: 120,
      marginLeft: 5,
      backgroundSize: 'contain',
      backgroundPositionY: 'top',
      backgroundPositionX: 'right',
    },
    cardIcon: {
      float: 'right',
      fontSize: theme.typography.display3.fontSize,
    },
  };
}

const StackCard = ({ classes, stack, openStack, deleteStack, editStack, typeName, userPermissions,
  openPermission, deletePermission, editPermission }) =>
  <Card className={classes.card}>
    <CardContent>
      <div className={classes.cardHeader}>
        <div>
          <Typography type="headline">{getDisplayName(stack)}</Typography>
          <div style={{ display: 'flex', direction: 'row' }}>
            <Typography style={{ marginRight: 6 }} type="subheading">{getStackType(stack, typeName)}</Typography>
            {typeName !== 'Data Store' && stack.status && <StackStatus status={stack.status}/>}
          </div>
        </div>
        {generateGetImage(classes)(stack)}
      </div>
      <Typography component="p">{getDescription(stack, typeName)}</Typography>
    </CardContent>
    {stack.status === READY &&
      <StackCardActions
        stack={stack}
        openStack={openStack}
        deleteStack={deleteStack}
        editStack={editStack}
        userPermissions={userPermissions}
        openPermission={openPermission}
        deletePermission={deletePermission}
        editPermission={editPermission}
      />}
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
    const stackDesciption = stack.type && stackDescriptions[stack.type];
    const logoImage = stackDesciption && stackDesciption.logo;
    const iconName = stackDesciption && stackDesciption.icon;

    if (logoImage) {
      return <CardMedia className={classes.cardMedia} image={logoImage} />;
    }

    return <Icon className={classes.cardIcon} children={iconName || 'create'} />;
  }

  return getImage;
}

function getDescription(stack, typeName) {
  if (stack.description) {
    return stack.description;
  } else if (stackDescriptions[stack.type]) {
    return stackDescriptions[stack.type].description;
  }
  return `A description of the ${typeName} purpose`;
}

function getStackType(stack, typeName) {
  return stack.type ? capitalize(stack.type) : `${capitalize(typeName)} type`;
}

export default withStyles(styles)(StackCard);
