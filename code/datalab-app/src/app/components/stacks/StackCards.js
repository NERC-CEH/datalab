import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import StackCard from './StackCard';
import NewStackButton from './NewStackButton';

const breakPoints = { xs: 12, sm: 6, md: 4, lg: 4, xl: 2 };

const StackCards = ({ stacks, typeName, openStack, deleteStack, openCreationForm }) => (
  <Grid container>
    {stacks.map((stack, index) => (
      <Grid key={index} item {...breakPoints}>
        <StackCard stack={stack} typeName={typeName} openStack={openStack} deleteStack={deleteStack} />
      </Grid>
    ))}
    <Grid item {...breakPoints}>
      <NewStackButton onClick={openCreationForm} typeName={typeName} />
    </Grid>
  </Grid>
);

StackCards.propTypes = {
  stacks: PropTypes.arrayOf(PropTypes.object).isRequired,
  typeName: PropTypes.string.isRequired,
  openStack: PropTypes.func.isRequired,
  deleteStack: PropTypes.func.isRequired,
  openCreationForm: PropTypes.func.isRequired,
};

export default StackCards;
