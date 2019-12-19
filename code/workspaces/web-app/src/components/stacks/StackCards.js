import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { sortBy } from 'lodash';
import StackCard from './StackCard';
import NewStackButton from './NewStackButton';
import PermissionWrapper from '../common/ComponentPermissionWrapper';
import PromisedContentWrapper from '../common/PromisedContentWrapper';

const styles = theme => ({
  stackDiv: {
    display: 'flex',
    flexDirection: 'column',
  },
  bottomControlDiv: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  placeholderCard: {
    width: '100%',
    height: 70,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
});

const StackCards = ({ stacks, typeName, typeNamePlural, openStack, deleteStack, editStack, openCreationForm,
  userPermissions, createPermission, openPermission, deletePermission, editPermission, getLogs, classes }) => {
  const sortedStacks = stacks.fetching ? [] : sortBy(stacks.value, stack => stack.displayName.toLowerCase());
  return (
    <div className={classes.stackDiv}>
      <PromisedContentWrapper fetchingClassName={classes.placeholderCard} promise={stacks}>
        <div> {/* extra div enables working css styling of stack card */}
          {sortedStacks && sortedStacks.length > 0
            ? sortedStacks.map(stack => (
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
              getLogs={getLogs}
            />))
            : <div className={classes.placeholderCard}>
              <Typography variant="body1">{`No ${typeNamePlural || 'items'} to display.`}</Typography>
            </div>
          }
        </div>
      </PromisedContentWrapper>
      <PermissionWrapper style={{ width: '100%' }} userPermissions={userPermissions()} permission={createPermission}>
        <div className={classes.bottomControlDiv}>
          <NewStackButton onClick={openCreationForm} typeName={typeName} />
        </div>
      </PermissionWrapper>
    </div>
  );
};

export default withStyles(styles)(StackCards);

StackCards.propTypes = {
  stacks: PropTypes.shape({
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.array.isRequired,
    error: PropTypes.object,
  }).isRequired,
  typeName: PropTypes.string.isRequired,
  openStack: PropTypes.func.isRequired,
  deleteStack: PropTypes.func.isRequired,
  editStack: PropTypes.func,
  getLogs: PropTypes.func,
  openCreationForm: PropTypes.func.isRequired,
  userPermissions: PropTypes.func.isRequired,
  createPermission: PropTypes.string.isRequired,
  openPermission: PropTypes.string.isRequired,
  deletePermission: PropTypes.string.isRequired,
  editPermission: PropTypes.string.isRequired,
};
