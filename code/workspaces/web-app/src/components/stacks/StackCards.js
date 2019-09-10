import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import StackCard from './StackCard';
import NewStackButton from './NewStackButton';
import PermissionWrapper from '../common/ComponentPermissionWrapper';

const breakPoints = { xs: 12 };

const styles = () => ({
  stackDiv: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const StackCards = ({ stacks, typeName, openStack, deleteStack, editStack, openCreationForm, userPermissions,
  createPermission, openPermission, deletePermission, editPermission, classes }) => (
  <div className={classes.stackDiv}>
    {stacks.map((stack, index) => (
      <StackCard
        key={stack.id}
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
    ))}
    <PermissionWrapper style={{ width: '100%' }} userPermissions={userPermissions} permission={createPermission}>
      <Grid item {...breakPoints}>
        <NewStackButton onClick={openCreationForm} typeName={typeName} />
      </Grid>
    </PermissionWrapper>
  </div>
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

export default withStyles(styles)(StackCards);
