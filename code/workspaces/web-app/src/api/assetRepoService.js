import { gqlMutation } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function addRepoMetadata(metadata) {
  const mutation = `
    CreateCentralAssetMetadata($metadata: CentralAssetMetadataCreationRequest!) {
      createCentralAssetMetadata(metadata: $metadata) {
        assetId
      }
    }`;

  return gqlMutation(mutation, { metadata })
    .then(errorHandler('data.createCentralAssetMetadata.assetId'));
}

function loadVisibleAssets(projectKey) {
  /*
  const query = `
    LoadVisibleAssets($projectKey: String!) {
      loadVisibleAssets {
        assetId, name, version, fileLocation
      }
    }`;

  return gqlQuery(query, { projectKey })
    .then(errorHandler('data.assets'));
    */

  return Promise.resolve([
    { assetId: 'asset-1', name: 'Test asset 1', version: '0.1', fileLocation: '/file/path1' },
    { assetId: 'asset-2', name: 'Test asset 2', version: '2.0', fileLocation: '/file/path2' },
  ]);
}

export default {
  addRepoMetadata,
  loadVisibleAssets,
};
