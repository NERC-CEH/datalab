import { gqlMutation } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function addRepoMetadata(metadata) {
  console.log(metadata);
  const mutation = `
    CreateCentralAssetMetadata($metadata: CentralAssetMetadataCreationRequest!) {
      createCentralAssetMetadata(metadata: $metadata) {
        assetId
      }
    }`;

  return gqlMutation(mutation, { metadata })
    .then(errorHandler('data.createCentralAssetMetadata.assetId'));
}

export default {
  addRepoMetadata,
};
