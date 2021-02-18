import assetRepoService from '../api/assetRepoService';

export const ADD_REPO_METADATA_ACTION = 'ADD_REPO_METADATA_ACTION';
export const CLEAR_REPO_METADATA_ACTION = 'CLEAR_REPO_METADATA_ACTION';
export const LOAD_VISIBLE_ASSETS_ACTION = 'LOAD_VISIBLE_ASSETS_ACTION';

const addRepoMetadata = metadata => ({
  type: ADD_REPO_METADATA_ACTION,
  payload: assetRepoService.addRepoMetadata(metadata),
});

const clearRepoMetadata = () => ({
  type: CLEAR_REPO_METADATA_ACTION,
  payload: null,
});

const loadVisibleAssets = projectKey => ({
  type: LOAD_VISIBLE_ASSETS_ACTION,
  payload: assetRepoService.loadVisibleAssets(projectKey),
});

export default {
  addRepoMetadata,
  clearRepoMetadata,
  loadVisibleAssets,
};
