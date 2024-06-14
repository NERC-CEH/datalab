import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { sortBy } from 'lodash';
import StackCard from './StackCard';
import NewStackButton from './NewStackButton';
import PermissionWrapper from '../common/ComponentPermissionWrapper';
import PromisedContentWrapper from '../common/PromisedContentWrapper';
import Pagination from './Pagination';
import { PROJECT_TYPE_NAME } from '../../containers/projects/projectTypeName';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

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

const buildCreateButton = ({ userPermissions, createPermission, openCreationForm, typeName, actionButtonLabelPrefix }) => {
  if (typeName === PROJECT_TYPE_NAME && !createPermission) {
    return <NewStackButton onClick={openCreationForm} typeName={typeName} labelPrefix={actionButtonLabelPrefix}/>;
  }

  return (
    <PermissionWrapper style={{ width: '100%' }} userPermissions={userPermissions()} permission={createPermission}>
      <NewStackButton onClick={openCreationForm} typeName={typeName} labelPrefix={actionButtonLabelPrefix}/>
    </PermissionWrapper>
  );
};

const StackCards = (
  { stacks, typeName, typeNamePlural, openStack, deleteStack, editStack, restartStack, scaleStack, openCreationForm, showCreateButton,
    userPermissions, createPermission, openPermission, deletePermission, editPermission, scalePermission, getLogs, shareStack,
    copySnippets = undefined, actionButtonLabelPrefix = 'Create', showUsernames },
) => {
  const classes = useStyles();
  const sortedStacks = stacks.fetching ? [] : sortBy(stacks.value, stack => stack.displayName.toLowerCase());
  const renderedStacks = sortedStacks && sortedStacks.length > 0
    ? sortedStacks.map(stack => (
      <StackCard
        showUsernames={showUsernames}
        key={stack.id}
        stack={stack}
        typeName={typeName}
        openStack={openStack}
        deleteStack={deleteStack}
        editStack={editStack}
        restartStack={restartStack}
        scaleStack={scaleStack}
        shareStack={shareStack}
        userPermissions={userPermissions(stack)}
        openPermission={openPermission}
        deletePermission={deletePermission}
        editPermission={editPermission}
        scalePermission={scalePermission}
        getLogs={getLogs}
        copySnippets={copySnippets}
      />))
    : [<div className={classes.placeholderCard} key={'placeholder-card'}>
        <Typography variant="body1">{`No ${typeNamePlural || 'items'} to display.`}</Typography>
      </div>];

  const actionButton = showCreateButton ? buildCreateButton({ userPermissions, createPermission, openCreationForm, typeName, actionButtonLabelPrefix }) : null;

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
  openStack: PropTypes.func,
  deleteStack: PropTypes.func,
  shareStack: PropTypes.func,
  editStack: PropTypes.func,
  restartStack: PropTypes.func,
  scaleStack: PropTypes.func,
  getLogs: PropTypes.func,
  openCreationForm: PropTypes.func,
  userPermissions: PropTypes.func.isRequired,
  createPermission: PropTypes.string,
  openPermission: PropTypes.string,
  deletePermission: PropTypes.string,
  editPermission: PropTypes.string,
  scalePermission: PropTypes.string,
  copySnippets: PropTypes.objectOf(PropTypes.func),
  showUsernames: PropTypes.bool.isRequired,
};
