import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import StackCard from './StackCard';
import CreateStackContainer from '../../containers/stacks/CreateStackContainer';

const StackCards = ({ stacks, openStack, deleteStack, typeName, containerType, dialogAction, formStateName }) => (
  <Card.Group>
    {stacks.map((stack, index) => (
      <StackCard key={index} stack={stack}
                 openStack={openStack} deleteStack={deleteStack} />
    ))}
    <CreateStackContainer typeName={typeName} containerType={containerType} dialogAction={dialogAction} formStateName={formStateName} />
  </Card.Group>
);

StackCards.propTypes = {
  stacks: PropTypes.arrayOf(PropTypes.object).isRequired,
  openStack: PropTypes.func.isRequired,
  deleteStack: PropTypes.func.isRequired,
};

export default StackCards;
