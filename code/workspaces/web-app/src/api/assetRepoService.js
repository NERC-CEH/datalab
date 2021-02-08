// import { gqlMutation } from './graphqlClient';
// import errorHandler from './graphqlErrorHandler';

function addRepoMetadata(metadata) {
  /*
  const mutation = `
    CreateCentralAssetMetadata($metadata: CentralAssetMetadataCreationRequest) {
      createCentralAssetMetadata(metadata: $metadata) {
        assetId
      }
    }`;

  return gqlMutation(mutation, { metadata })
    .then(errorHandler('data.dataStorage'));
    */
  return Promise.resolve('asset-1234');
}

export default {
  addRepoMetadata,
};
