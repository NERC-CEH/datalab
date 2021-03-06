import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { permissionTypes } from 'common';
import { projectKeyPermission } from 'common/src/permissionTypes';
import { reset } from 'redux-form';
import copy from 'copy-to-clipboard';
import StackCards from '../../components/stacks/StackCards';
import { useClustersByType } from '../../hooks/clustersHooks';
import clusterActions from '../../actions/clusterActions';
import { useCurrentUserId } from '../../hooks/authHooks';
import modalDialogActions from '../../actions/modalDialogActions';
import { getClusterMaxWorkers, getWorkerCpuMax, getWorkerMemoryMax } from '../../config/clusters';
import { MODAL_TYPE_CREATE_CLUSTER, MODAL_TYPE_CONFIRMATION } from '../../constants/modaltypes';
import { useDataStorageForUserInProject } from '../../hooks/dataStorageHooks';
import dataStorageActions from '../../actions/dataStorageActions';
import notify from '../../components/common/notify';
import { CLUSTER_TYPE_NAME, CLUSTER_TYPE_NAME_PLURAL } from './clusterTypeName';

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

const copySnippet = ({ schedulerAddress }) => {
  const proxyAddress = schedulerAddress.replace('tcp://', 'proxy/').replace('8786', '8787');
  const message = `# Paste this into your notebook cell
# Note that the Dask scheduler can be accessed from the Dask JupyterLab extension with address
# ${proxyAddress}
from dask.distributed import Client
c = Client("${schedulerAddress}")
c
`;
  try {
    copy(message);
    notify.success('Clipboard contains snippet for notebook cell');
  } catch (error) {
    notify.error('Unable to access clipboard.');
  }
};

const ProjectClustersContainer = ({ clusterType, projectKey, userPermissions, modifyData }) => {
  const dispatch = useDispatch();
  const currentUserId = useCurrentUserId();
  const { value: dataStores } = useDataStorageForUserInProject(currentUserId, projectKey);
  const clusters = clustersToStacks(useClustersByType(clusterType), projectKey);

  useEffect(() => {
    if (projectKey && modifyData) {
      dispatch(clusterActions.loadClusters(projectKey));
      dispatch(dataStorageActions.loadDataStorage(projectKey));
    }
  }, [dispatch, projectKey, modifyData]);

  const createDaskClusterDialogProps = getDialogProps(dispatch, projectKey, clusterType, dataStores);

  return (
      <StackCards
        stacks={clusters}
        typeName={CLUSTER_TYPE_NAME}
        typeNamePlural={CLUSTER_TYPE_NAME_PLURAL}
        userPermissions={() => userPermissions}
        openCreationForm={() => dispatch(modalDialogActions.openModalDialog(MODAL_TYPE_CREATE_CLUSTER, createDaskClusterDialogProps))}
        createPermission={projectKeyPermission(PROJECT_KEY_CLUSTERS_CREATE, projectKey)}
        showCreateButton={modifyData}
        deleteStack={modifyData ? confirmDeleteCluster(dispatch) : undefined}
        copySnippet={copySnippet}
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
  dataStorageOptions: dataStores.map(store => ({ text: store.displayName, value: store.name })),
});

export default ProjectClustersContainer;

ProjectClustersContainer.propTypes = {
  clusterType: PropTypes.string.isRequired,
};
