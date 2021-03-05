import { gqlMutation } from './graphqlClient';
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

export default { createCluster };
