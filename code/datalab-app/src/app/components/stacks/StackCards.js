import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import StackCard from './StackCard';
import NewStackButton from './NewStackButton';
import PermissionWrapper from '../app/ComponentPermissionWrapper';

const breakPoints = { xs: 12, sm: 6, md: 4, lg: 4, xl: 2 };

const StackCards = ({ stacks, typeName, openStack, deleteStack, openCreationForm, userPermissions }) => (
  <Grid container>
    {stacks.map((stack, index) => (
      <Grid key={index} item {...breakPoints}>
        <StackCard
          stack={stack}
          typeName={typeName}
          openStack={openStack}
          deleteStack={deleteStack}
          userPermissions={userPermissions} />
      </Grid>
    ))}
    <PermissionWrapper userPermissions={userPermissions} permission="project:stacks:create" >
      <Grid item {...breakPoints}>
        <NewStackButton onClick={openCreationForm} typeName={typeName} />
      </Grid>
    </PermissionWrapper>
  </Grid>
);

StackCards.propTypes = {
  stacks: PropTypes.arrayOf(PropTypes.object).isRequired,
  typeName: PropTypes.string.isRequired,
  openStack: PropTypes.func.isRequired,
  deleteStack: PropTypes.func.isRequired,
  openCreationForm: PropTypes.func.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default StackCards;
