import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import { withStyles } from 'material-ui/styles';
import stackDescriptions from './stackDescriptions';

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
    },
  };
}

const StackCard = ({ classes, stack, openStack, deleteStack, typeName }) =>
  <Card className={classes.card}>
    <CardContent>
      <div className={classes.cardHeader}>
        <div>
          <Typography type="headline">{getDisplayName(stack)}</Typography>
          <Typography type="subheading">{getStackType(stack, typeName)}</Typography>
        </div>
        {generateGetImage(classes)(stack)}
      </div>
      <Typography component="p">{getDescription(stack, typeName)}</Typography>
    </CardContent>
    <CardActions>
      <Button color="primary" raised disabled={!openStack} onClick={() => openStack(stack.id)}>
        Open
      </Button>
      <Button color="accent" raised disabled={!deleteStack} onClick={() => deleteStack(stack)}>
        Delete
      </Button>
    </CardActions>
  </Card>;

StackCard.propTypes = {
  classes: PropTypes.object.isRequired,
  stack: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  openStack: PropTypes.func,
  deleteStack: PropTypes.func,
  typeName: PropTypes.string.isRequired,
};

function getDisplayName(stack) {
  return stack.displayName || 'Display Name';
}

function generateGetImage(classes) {
  function getImage(stack) {
    if (stack.type && stackDescriptions[stack.type]) {
      const logo = stackDescriptions[stack.type].logo;
      return <CardMedia className={classes.cardMedia} image={logo} />;
    }

    return <Icon className={classes.cardIcon} children="create" />;
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
  return stack.type ? capitalizeString(stack.type) : `${capitalizeString(typeName)} type`;
}

function capitalizeString(text) {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export default withStyles(styles)(StackCard);
