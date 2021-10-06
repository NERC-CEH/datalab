import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { permissionTypes, statusTypes } from 'common';
import { projectKeyPermission } from 'common/src/permissionTypes';
import { reset } from 'redux-form';
import StackCards from '../../components/stacks/StackCards';
import { useClustersByType } from '../../hooks/clustersHooks';
import clusterActions from '../../actions/clusterActions';
import { useCurrentUserId } from '../../hooks/authHooks';
import modalDialogActions from '../../actions/modalDialogActions';
import { getClusterMaxWorkers, getWorkerCpuMax, getWorkerMemoryMax, getCondaRequired } from '../../config/clusters';
import { MODAL_TYPE_CREATE_CLUSTER, MODAL_TYPE_CONFIRMATION } from '../../constants/modaltypes';
import { useDataStorageForUserInProject } from '../../hooks/dataStorageHooks';
import dataStorageActions from '../../actions/dataStorageActions';
import notify from '../../components/common/notify';
import { CLUSTER_TYPE_NAME, CLUSTER_TYPE_NAME_PLURAL } from './clusterTypeName';
import assetRepoActions from '../../actions/assetRepoActions';

const refreshInterval = 15000;

const { projectPermissions: { PROJECT_KEY_CLUSTERS_CREATE, PROJECT_KEY_CLUSTERS_DELETE, PROJECT_KEY_CLUSTERS_EDIT, PROJECT_KEY_CLUSTERS_OPEN } } = permissionTypes;

export const FORM_NAME = 'createCluster';

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

const scaleCluster = async (dispatch, cluster, replicas) => {
  try {
    dispatch(modalDialogActions.closeModalDialog());
    await dispatch(clusterActions.scaleCluster(cluster, replicas));
    notify.success(`Cluster ${replicas > 0 ? 'started' : 'suspended'}`);
  } catch (error) {
    notify.error('Unable to scale cluster');
  } finally {
    dispatch(clusterActions.loadClusters(cluster.projectKey));
  }
};

export const confirmScaleCluster = dispatch => async (cluster) => {
  if (cluster.status === statusTypes.SUSPENDED) {
    scaleCluster(dispatch, cluster, 1);
    return;
  }

  dispatch(modalDialogActions.openModalDialog(MODAL_TYPE_CONFIRMATION, {
    title: `Suspend ${cluster.displayName} cluster?`,
    body: `Would you like to suspend the ${cluster.displayName} cluster?`,
    onSubmit: () => scaleCluster(dispatch, cluster, 0),
    onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
  }));
};

const getOpenCreationForm = (dispatch, projectKey, clusterType, dataStores) => {
  if (clusterType) {
    const createClusterDialogProps = getDialogProps(dispatch, projectKey, clusterType, dataStores);
    return () => dispatch(modalDialogActions.openModalDialog(MODAL_TYPE_CREATE_CLUSTER, createClusterDialogProps));
  }

  return undefined;
};

const ProjectClustersContainer = ({ clusterType, projectKey, userPermissions, modifyData, copySnippets }) => {
  const dispatch = useDispatch();
  const currentUserId = useCurrentUserId();
  const { value: dataStores } = useDataStorageForUserInProject(currentUserId, projectKey);
  const clusters = clustersToStacks(useClustersByType(clusterType), projectKey);

  useEffect(() => {
    if (projectKey && modifyData) {
      dispatch(clusterActions.loadClusters(projectKey));
      dispatch(dataStorageActions.loadDataStorage(projectKey));
      dispatch(assetRepoActions.loadVisibleAssets(projectKey));
    }

    // After an interval, update the clusters list in case of any status changes.
    // This uses "updateClusters" to avoid flickering.
    const interval = setInterval(() => {
      if (projectKey && modifyData) {
        dispatch(clusterActions.updateClusters(projectKey));
        dispatch(dataStorageActions.loadDataStorage(projectKey));
        dispatch(assetRepoActions.loadVisibleAssets(projectKey));
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [dispatch, modifyData, projectKey]);

  const openCreationForm = getOpenCreationForm(dispatch, projectKey, clusterType, dataStores);

  return (
    <StackCards
      stacks={clusters}
      typeName={CLUSTER_TYPE_NAME}
      typeNamePlural={CLUSTER_TYPE_NAME_PLURAL}
      userPermissions={() => userPermissions}
      openCreationForm={openCreationForm}
      createPermission={projectKeyPermission(PROJECT_KEY_CLUSTERS_CREATE, projectKey)}
      showCreateButton={modifyData}
      deleteStack={modifyData ? confirmDeleteCluster(dispatch) : undefined}
      scaleStack={modifyData ? confirmScaleCluster(dispatch) : undefined}
      copySnippets={copySnippets}
      deletePermission={projectKeyPermission(PROJECT_KEY_CLUSTERS_DELETE, projectKey)}
      editPermission={projectKeyPermission(PROJECT_KEY_CLUSTERS_EDIT, projectKey)}
      openPermission={projectKeyPermission(PROJECT_KEY_CLUSTERS_OPEN, projectKey)}
    />
  );
};

const clustersToStacks = (clusters, projectKey) => ({
  ...clusters,
  value: clusters.value
    .filter(cluster => cluster.projectKey === projectKey)
    .map(cluster => ({
      ...cluster,
      description: `${cluster.schedulerAddress} is the scheduler address.`,
    })),
});

export const getDialogProps = (dispatch, projectKey, clusterType, dataStores) => ({
  title: `Create ${CLUSTER_TYPE_NAME}`,
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
      notify.success(`${CLUSTER_TYPE_NAME} created`);
      dispatch(reset(FORM_NAME));
      dispatch(clusterActions.loadClusters(projectKey));
    } else {
      notify.error(`Unable to create ${CLUSTER_TYPE_NAME}`);
    }
  },
  onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
  clusterMaxWorkers: getClusterMaxWorkers(clusterType),
  workerMaxMemory: getWorkerMemoryMax(clusterType),
  workerMaxCpu: getWorkerCpuMax(clusterType),
  condaRequired: getCondaRequired(clusterType),
  dataStorageOptions: dataStores.map(store => ({ text: store.displayName, value: store.name })),
  projectKey,
});

export default ProjectClustersContainer;

ProjectClustersContainer.propTypes = {
  clusterType: PropTypes.string,
  copySnippets: PropTypes.objectOf(PropTypes.func),
};
