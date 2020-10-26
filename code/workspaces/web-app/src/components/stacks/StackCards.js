import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { sortBy } from 'lodash';
import StackCard from './StackCard';
import NewStackButton from './NewStackButton';
import PermissionWrapper from '../common/ComponentPermissionWrapper';
import PromisedContentWrapper from '../common/PromisedContentWrapper';
import Pagination from './Pagination';

const useStyles = makeStyles(theme => ({
  stackDiv: {
    display: 'flex',
    flexDirection: 'column',
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
}));

const StackCards = (
  { stacks, typeName, typeNamePlural, openStack, deleteStack, editStack, restartStack, openCreationForm, showCreateButton,
    userPermissions, createPermission, openPermission, deletePermission, editPermission, getLogs, shareStack },
) => {
  const classes = useStyles();

  const sortedStacks = stacks.fetching ? [] : sortBy(stacks.value, stack => stack.displayName.toLowerCase());
  const renderedStacks = sortedStacks && sortedStacks.length > 0
    ? sortedStacks.map(stack => (
      <StackCard
        key={stack.id}
        stack={stack}
        typeName={typeName}
        openStack={openStack}
        deleteStack={deleteStack}
        editStack={editStack}
        restartStack={restartStack}
        shareStack={shareStack}
        userPermissions={userPermissions(stack)}
        openPermission={openPermission}
        deletePermission={deletePermission}
        editPermission={editPermission}
        getLogs={getLogs}
      />))
    : [<div className={classes.placeholderCard} key={'placeholder-card'}>
        <Typography variant="body1">{`No ${typeNamePlural || 'items'} to display.`}</Typography>
      </div>];

  const actionButton = showCreateButton ? (
    <PermissionWrapper style={{ width: '100%' }} userPermissions={userPermissions()} permission={createPermission}>
      <NewStackButton onClick={openCreationForm} typeName={typeName} />
    </PermissionWrapper>
  ) : null;

  return (
    <div className={classes.stackDiv}>
      <PromisedContentWrapper fetchingClassName={classes.placeholderCard} promise={stacks}>
        <Pagination items={renderedStacks} paginationBarItems={actionButton}/>
      </PromisedContentWrapper>
    </div>
  );
};

export default StackCards;

StackCards.propTypes = {
  stacks: PropTypes.shape({
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.array.isRequired,
    error: PropTypes.object,
  }).isRequired,
  typeName: PropTypes.string.isRequired,
  openStack: PropTypes.func.isRequired,
  deleteStack: PropTypes.func.isRequired,
  shareStack: PropTypes.func,
  editStack: PropTypes.func,
  restartStack: PropTypes.func,
  getLogs: PropTypes.func,
  openCreationForm: PropTypes.func.isRequired,
  userPermissions: PropTypes.func.isRequired,
  createPermission: PropTypes.string.isRequired,
  openPermission: PropTypes.string.isRequired,
  deletePermission: PropTypes.string.isRequired,
  editPermission: PropTypes.string.isRequired,
};
