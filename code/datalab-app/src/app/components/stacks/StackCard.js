import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Image, Icon } from 'semantic-ui-react';
import stackDescriptions from './stackDescriptions';

const iconStyle = { marginLeft: '5px', cursor: 'pointer' };

const StackCard = ({ stack, openStack, deleteStack }) =>
  <Card>
    <Card.Content>
      {getImage(stack)}
      <Card.Header>
        {getDisplayName(stack)}
        {deleteStack ? <Icon style={iconStyle} size='small' color='blue' name='trash outline' onClick={() => deleteStack(stack)} /> : undefined}
      </Card.Header>
      <Card.Meta>
        {getStackType(stack)}
      </Card.Meta>
      <Card.Description>
        {getDescription(stack)}
      </Card.Description>
    </Card.Content>
    <Button primary fluid disabled={!openStack} onClick={() => openStack(stack.id)}>
      Open
    </Button>
  </Card>;

StackCard.propTypes = {
  stack: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  openStack: PropTypes.func,
  delectStack: PropTypes.func,
};

function getDisplayName(stack) {
  return stack.displayName || 'Display Name';
}

function getImage(stack) {
  if (stack.type && stackDescriptions[stack.type]) {
    const logo = stackDescriptions[stack.type].logo;
    return <Image floated='right' size='tiny' src={logo}/>;
  }

  const style = { float: 'right' };
  return <Icon style={style} size='big' name='question circle' />;
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
