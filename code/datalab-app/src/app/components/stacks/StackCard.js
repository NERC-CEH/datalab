import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import stackDescriptions from './stackDescriptions';

const StackCard = ({ stack, openStack, deleteStack }) =>
  <Card style={{ height: '100%', minHeight: 230, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <CardContent>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Typography type="headline">{getDisplayName(stack)}</Typography>
          <Typography type="subheading">{getStackType(stack)}</Typography>
        </div>
        {getImage(stack)}
      </div>
      <Typography component="p">{getDescription(stack)}</Typography>
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
  stack: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  openStack: PropTypes.func,
  deleteStack: PropTypes.func,
};

function getDisplayName(stack) {
  return stack.displayName || 'Display Name';
}

function getImage(stack) {
  if (stack.type && stackDescriptions[stack.type]) {
    const logo = stackDescriptions[stack.type].logo;
    return <CardMedia style={{ height: 70, width: 120, marginLeft: 5, backgroundSize: 'contain', backgroundPositionY: 'top', backgroundPositionX: 'right' }} image={logo} />;
  }

  const style = { float: 'right' };
  return <Icon style={style} children="create" />;
}

function getDescription(stack) {
  if (stack.description) {
    return stack.description;
  } else if (stackDescriptions[stack.type]) {
    return stackDescriptions[stack.type].description;
  }
  return 'A description of the notebook purpose';
}

function getStackType(stack) {
  return stack.type ? capitalizeString(stack.type) : 'Notebook type';
}

function capitalizeString(text) {
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
}

export default StackCard;
