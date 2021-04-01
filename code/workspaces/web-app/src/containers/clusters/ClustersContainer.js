import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { permissionTypes } from 'common';
import { projectKeyPermission } from 'common/src/permissionTypes';
import { reset } from 'redux-form';
import StackCards from '../../components/stacks/StackCards';
import { useClustersByType } from '../../hooks/clustersHooks';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';
import clusterActions from '../../actions/clusterActions';
import { useCurrentUserId, useCurrentUserPermissions } from '../../hooks/authHooks';
import modalDialogActions from '../../actions/modalDialogActions';
import { getClusterMaxWorkers, getWorkerCpuMax, getWorkerMemoryMax } from '../../config/clusters';
import { MODAL_TYPE_CREATE_CLUSTER, MODAL_TYPE_CONFIRMATION } from '../../constants/modaltypes';
import { useDataStorageForUserInProject } from '../../hooks/dataStorageHooks';
import dataStorageActions from '../../actions/dataStorageActions';
import notify from '../../components/common/notify';

const { projectPermissions: { PROJECT_KEY_CLUSTERS_CREATE, PROJECT_KEY_CLUSTERS_DELETE, PROJECT_KEY_CLUSTERS_EDIT } } = permissionTypes;

const TYPE_NAME = 'Cluster';
const TYPE_NAME_PLURAL = 'Clusters';
const FORM_NAME = 'createCluster';

const deleteCluster = async (dispatch, cluster) => {
  try {
    await dispatch(clusterActions.deleteCluster(cluster));
    dispatch(modalDialogActions.closeModalDialog());
    notify.success('Cluster deleted.');
  } catch (error) {
    notify.error('Unable to delete cluster.');
  } finally {
    dispatch(clusterActions.loadClusters(cluster.projectKey));
  }
};

const confirmDeleteCluster = dispatch => cluster => dispatch(modalDialogActions.openModalDialog(MODAL_TYPE_CONFIRMATION, {
  title: `Delete ${cluster.displayName} cluster`,
  body: `Would you like to delete the ${cluster.displayName} cluster?
  The cluster will stop and be permanently deleted.`,
  onSubmit: () => deleteCluster(dispatch, cluster),
  onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
}));

const ClustersContainer = ({ clusterType, className }) => {
  const dispatch = useDispatch();
  const userPermissions = useCurrentUserPermissions();
  const currentUserId = useCurrentUserId();
  const { value: projectKey } = useCurrentProjectKey();
  const { value: dataStores } = useDataStorageForUserInProject(currentUserId, projectKey);
  const clusters = clustersToStacks(useClustersByType(clusterType));

  useEffect(() => {
    if (projectKey) dispatch(clusterActions.loadClusters(projectKey));
  }, [dispatch, projectKey]);

  useEffect(() => {
    if (projectKey) dispatch(dataStorageActions.loadDataStorage(projectKey));
  }, [dispatch, projectKey]);

  const createDaskClusterDialogProps = getDialogProps(dispatch, projectKey, clusterType, dataStores);

  return (
    <div className={className}>
      <StackCards
        stacks={clusters}
        typeName={TYPE_NAME}
        typeNamePlural={TYPE_NAME_PLURAL}
        userPermissions={() => userPermissions.value}
        openCreationForm={() => dispatch(modalDialogActions.openModalDialog(MODAL_TYPE_CREATE_CLUSTER, createDaskClusterDialogProps))}
        createPermission={projectKeyPermission(PROJECT_KEY_CLUSTERS_CREATE, projectKey)}
        showCreateButton
        deleteStack={confirmDeleteCluster(dispatch)}
        deletePermission={projectKeyPermission(PROJECT_KEY_CLUSTERS_DELETE, projectKey)}
        editPermission={projectKeyPermission(PROJECT_KEY_CLUSTERS_EDIT, projectKey)}
      />
    </div>
  );
};

const clustersToStacks = clusters => ({
  ...clusters,
  value: clusters.value.map(cluster => ({
    ...cluster,
    description: `${cluster.schedulerAddress} is the scheduler address.`,
  })),
});

export const getDialogProps = (dispatch, projectKey, clusterType, dataStores) => ({
  title: 'Create Cluster',
  formName: FORM_NAME,
  onSubmit: async (cluster) => {
    dispatch(modalDialogActions.closeModalDialog());
    let creationSuccess;
    try {
      await dispatch(clusterActions.createCluster({
        type: clusterType,
        projectKey,
        ...cluster,
      }));
      creationSuccess = true;
    } catch (error) {
      creationSuccess = false;
    }
    if (creationSuccess) {
      notify.success(`${TYPE_NAME} created`);
      dispatch(reset(FORM_NAME));
      dispatch(clusterActions.loadClusters(projectKey));
    } else {
      notify.error(`Unable to create ${TYPE_NAME}`);
    }
  },
  onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
  clusterMaxWorkers: getClusterMaxWorkers(clusterType),
  workerMaxMemory: getWorkerMemoryMax(clusterType),
  workerMaxCpu: getWorkerCpuMax(clusterType),
  dataStorageOptions: dataStores.map(store => ({ text: store.displayName, value: store.name })),
});

export default ClustersContainer;

ClustersContainer.propTypes = {
  clusterType: PropTypes.string.isRequired,
};
