import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import StackCard from './StackCard';
import CreateStackContainer from '../../containers/stacks/CreateStackContainer';

const brakePoints = { xs: 12, sm: 6, md: 4, lg: 4, xl: 2 };

const StackCards = ({ stacks, openStack, deleteStack, typeName, containerType, dialogAction, formStateName }) => (
  <Grid container>
    {stacks.map((stack, index) => (
      <Grid key={index} item {...brakePoints}>
        <StackCard stack={stack} openStack={openStack} deleteStack={deleteStack} typeName={typeName} />
      </Grid>
    ))}
    <Grid item {...brakePoints}>
      <CreateStackContainer typeName={typeName} containerType={containerType} dialogAction={dialogAction} formStateName={formStateName} />
    </Grid>
  </Grid>
);

StackCards.propTypes = {
  stacks: PropTypes.arrayOf(PropTypes.object).isRequired,
  openStack: PropTypes.func.isRequired,
  deleteStack: PropTypes.func.isRequired,
};

export default StackCards;
