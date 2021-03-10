import { gqlMutation, gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function createCluster(cluster) {
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
      }
    }
  `;

  return gqlQuery(query, { projectKey })
    .then(errorHandler('data.clusters'));
}

export default { createCluster, loadClusters };
