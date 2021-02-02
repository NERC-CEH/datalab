import assetRepoService from '../api/assetRepoService';

export const ADD_REPO_METADATA_ACTION = 'ADD_REPO_METADATA_ACTION';
export const CLEAR_REPO_METADATA_ACTION = 'CLEAR_REPO_METADATA_ACTION';

const addRepoMetadata = metadata => ({
  type: ADD_REPO_METADATA_ACTION,
  payload: assetRepoService.addRepoMetadata(metadata),
});

const clearRepoMetadata = () => ({
  type: CLEAR_REPO_METADATA_ACTION,
  payload: null,
});

export default {
  addRepoMetadata,
  clearRepoMetadata,
};
