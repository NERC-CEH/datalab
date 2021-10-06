import clusterService from '../api/clusterService';

export const CREATE_CLUSTER_ACTION = 'CREATE_CLUSTER_ACTION';
export const LOAD_CLUSTERS_ACTION = 'LOAD_CLUSTERS_ACTION';
export const UPDATE_CLUSTERS_ACTION = 'UPDATE_CLUSTERS_ACTION';
export const DELETE_CLUSTER_ACTION = 'DELETE_CLUSTER_ACTION';
export const SCALE_CLUSTER_ACTION = 'SCALE_CLUSTER_ACTION';

const createCluster = cluster => ({
  type: CREATE_CLUSTER_ACTION,
  payload: clusterService.createCluster(cluster),
});

const deleteCluster = ({ projectKey, name, type }) => ({
  type: DELETE_CLUSTER_ACTION,
  payload: clusterService.deleteCluster({ projectKey, name, type }),
});

const loadClusters = projectKey => ({
  type: LOAD_CLUSTERS_ACTION,
  payload: clusterService.loadClusters(projectKey).then(clusters => ({ projectKey, clusters })),
});

const updateClusters = projectKey => ({
  type: UPDATE_CLUSTERS_ACTION,
  payload: clusterService.loadClusters(projectKey).then(clusters => ({ projectKey, clusters })),
});

const scaleCluster = ({ projectKey, name, type }, replicas) => ({
  type: SCALE_CLUSTER_ACTION,
  payload: clusterService.scaleCluster({ projectKey, name, type }, replicas),
});

export default { createCluster, loadClusters, updateClusters, deleteCluster, scaleCluster };
