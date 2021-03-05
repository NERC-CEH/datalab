import clusterService from '../api/clusterService';

export const CREATE_CLUSTER_ACTION = 'CREATE_CLUSTER_ACTION';

const createCluster = cluster => ({
  type: CREATE_CLUSTER_ACTION,
  payload: clusterService.createCluster(cluster),
});

export default { createCluster };
