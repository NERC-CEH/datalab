import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import StackCard from './StackCard';
import NewStackButton from './NewStackButton';
import PermissionWrapper from '../common/ComponentPermissionWrapper';

const styles = theme => ({
  stackDiv: {
    display: 'flex',
    flexDirection: 'column',
  },
  bottomControlDiv: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  noItemsMessage: {
    display: 'flex',
    justifyContent: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing(3)}px 0`,
  },
});

const StackCards = ({ stacks, typeName, typeNamePlural, openStack, deleteStack, editStack, openCreationForm,
  userPermissions, createPermission, openPermission, deletePermission, editPermission, classes }) => (
  <div className={classes.stackDiv}>
    <div> {/* extra div enables working css styling of stack card */}
      {stacks && stacks.length > 0
        ? stacks.map(stack => (
          <StackCard
            key={stack.id}
            stack={stack}
            typeName={typeName}
            openStack={openStack}
            deleteStack={deleteStack}
            editStack={editStack}
            userPermissions={userPermissions(stack)}
            openPermission={openPermission}
            deletePermission={deletePermission}
            editPermission={editPermission}
          />))
        : <div className={classes.noItemsMessage}>
            <Typography variant="body1">{`No ${typeNamePlural || 'items'} to display.`}</Typography>
          </div>
      }
    </div>
    <PermissionWrapper style={{ width: '100%' }} userPermissions={userPermissions()} permission={createPermission}>
      <div className={classes.bottomControlDiv}>
        <NewStackButton onClick={openCreationForm} typeName={typeName} />
      </div>
    </PermissionWrapper>
  </div>
);

export default withStyles(styles)(StackCards);

StackCards.propTypes = {
  stacks: PropTypes.arrayOf(PropTypes.object).isRequired,
  typeName: PropTypes.string.isRequired,
  openStack: PropTypes.func.isRequired,
  deleteStack: PropTypes.func.isRequired,
  editStack: PropTypes.func,
  openCreationForm: PropTypes.func.isRequired,
  userPermissions: PropTypes.func.isRequired,
  createPermission: PropTypes.string.isRequired,
  openPermission: PropTypes.string.isRequired,
  deletePermission: PropTypes.string.isRequired,
  editPermission: PropTypes.string.isRequired,
};
