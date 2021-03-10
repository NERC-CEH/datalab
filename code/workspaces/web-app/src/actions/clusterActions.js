import clusterService from '../api/clusterService';

export const CREATE_CLUSTER_ACTION = 'CREATE_CLUSTER_ACTION';
export const LOAD_CLUSTERS_ACTION = 'LOAD_CLUSTERS_ACTION';

const createCluster = cluster => ({
  type: CREATE_CLUSTER_ACTION,
  payload: clusterService.createCluster(cluster),
});

const loadClusters = projectKey => ({
  type: LOAD_CLUSTERS_ACTION,
  payload: clusterService.loadClusters(projectKey),
});

export default { createCluster, loadClusters };
