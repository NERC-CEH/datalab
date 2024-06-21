import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { mapKeys, get, find } from 'lodash';
import userActions from '../../actions/userActions';
import { useProjectUsers } from '../../hooks/projectUsersHooks';

const LoadUserManagementModalWrapper = ({ title, onCancel, Dialog, dataStoreId, projectKey, userKeysMapping, stack, typeName }) => {
  const dispatch = useDispatch();

  const dataStorage = useSelector(state => find(state.dataStorage.value, { id: dataStoreId }));
  const projectUsers = useProjectUsers();

  const remappedProjectUsers = useMemo(() => (userKeysMapping
    ? projectUsers.value.map(user => mapKeys(user, (_value, key) => get(userKeysMapping, key)))
    : projectUsers.value),
  [userKeysMapping, projectUsers]);

  useEffect(() => dispatch(userActions.listUsers()), [dispatch]);

  const currentUsers = remappedProjectUsers.filter(user => dataStorage.users.includes(user.value));

  return <Dialog
    onCancel={onCancel}
    title={title}
    currentUsers={currentUsers}
    userList={remappedProjectUsers}
    usersFetching={projectUsers.fetching.inProgress}
    stack={stack}
    typeName={typeName}
    projectKey={projectKey}
  />;
};

LoadUserManagementModalWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  Dialog: PropTypes.func.isRequired,
  dataStoreId: PropTypes.string.isRequired,
  projectKey: PropTypes.string.isRequired,
  userKeysMapping: PropTypes.object.isRequired,
  stack: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  typeName: PropTypes.string.isRequired,
};

export default LoadUserManagementModalWrapper;
