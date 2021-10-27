import assetRepoService from '../api/assetRepoService';

export const ADD_REPO_METADATA_ACTION = 'ADD_REPO_METADATA_ACTION';
export const EDIT_REPO_METADATA_ACTION = 'EDIT_REPO_METADATA_ACTION';
export const CLEAR_REPO_METADATA_ACTION = 'CLEAR_REPO_METADATA_ACTION';
export const LOAD_VISIBLE_ASSETS_ACTION = 'LOAD_VISIBLE_ASSETS_ACTION';
export const LOAD_ALL_ASSETS_ACTION = 'LOAD_ALL_ASSETS_ACTION';

const addRepoMetadata = metadata => ({
  type: ADD_REPO_METADATA_ACTION,
  payload: assetRepoService.addRepoMetadata(metadata),
});

const editRepoMetadata = metadata => ({
  type: EDIT_REPO_METADATA_ACTION,
  payload: assetRepoService.editRepoMetadata(metadata),
});

const clearRepoMetadata = () => ({
  type: CLEAR_REPO_METADATA_ACTION,
  payload: null,
});

const loadVisibleAssets = projectKey => ({
  type: LOAD_VISIBLE_ASSETS_ACTION,
  payload: assetRepoService.loadVisibleAssets(projectKey),
});

const loadAllAssets = () => ({
  type: LOAD_ALL_ASSETS_ACTION,
  payload: assetRepoService.loadAllAssets(),
});

const assetRepoActions = {
  addRepoMetadata,
  editRepoMetadata,
  clearRepoMetadata,
  loadVisibleAssets,
  loadAllAssets,
};
export default assetRepoActions;
