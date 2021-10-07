import { gqlMutation, gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function createCluster(clusterWithAssets) {
  const cluster = {
    ...clusterWithAssets,
    assetIds: clusterWithAssets.assets ? clusterWithAssets.assets.map(asset => asset.assetId) : [],
  };
  delete cluster.assets;

  const mutation = `
    CreateCluster($cluster: ClusterCreationRequest!) {
      createCluster(cluster: $cluster) {
        id
      }
    }
  `;

  return gqlMutation(mutation, { cluster })
    .then(errorHandler('data.createCluster'));
}

function deleteCluster(cluster) {
  const mutation = `
    DeleteCluster($cluster: ClusterDeletionRequest!) {
      deleteCluster(cluster: $cluster) {
        name
      }
    }`;

  return gqlMutation(mutation, { cluster })
    .then(errorHandler('data.cluster'));
}

function loadClusters(projectKey) {
  const query = `
    LoadClusters($projectKey: String!) {
      clusters(projectKey: $projectKey) {
        id
        type
        projectKey
        name
        displayName
        schedulerAddress
        condaPath
        maxWorkerMemoryGb
        status
      }
    }
  `;

  return gqlQuery(query, { projectKey })
    .then(errorHandler('data.clusters'));
}

const scaleCluster = async (cluster, replicas) => {
  const operation = replicas > 0 ? 'scaleupCluster' : 'scaledownCluster';
  const mutation = `
    ScaleCluster($cluster: ScaleRequest) {
      ${operation}(cluster: $cluster) {
        message
      }
    }`;

  const response = await gqlMutation(mutation, { cluster });
  return errorHandler(`data.${replicas > 0 ? 'scaleupCluster' : 'scaledownCluster'}`)(response);
};

export default { createCluster, deleteCluster, loadClusters, scaleCluster };
