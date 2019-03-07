import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import StackCard from './StackCard';
import NewStackButton from './NewStackButton';
import PermissionWrapper from '../common/ComponentPermissionWrapper';

const breakPoints = { xs: 12, sm: 6, md: 4, lg: 4, xl: 2 };

const StackCards = ({ stacks, typeName, openStack, deleteStack, editStack, openCreationForm, userPermissions,
                      createPermission, openPermission, deletePermission, editPermission }) => (
  <Grid container spacing={16}>
    {stacks.map((stack, index) => (
      <Grid key={index} item {...breakPoints}>
        <StackCard
          stack={stack}
          typeName={typeName}
          openStack={openStack}
          deleteStack={deleteStack}
          editStack={editStack}
          userPermissions={userPermissions}
          openPermission={openPermission}
          deletePermission={deletePermission}
          editPermission={editPermission}
        />
      </Grid>
    ))}
    <PermissionWrapper style={{ width: '100%' }} userPermissions={userPermissions} permission={createPermission}>
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
  editStack: PropTypes.func,
  openCreationForm: PropTypes.func.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  createPermission: PropTypes.string.isRequired,
  openPermission: PropTypes.string.isRequired,
  deletePermission: PropTypes.string.isRequired,
  editPermission: PropTypes.string.isRequired,
};

export default StackCards;
