import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import {
  ADD_REPO_METADATA_ACTION,
  CLEAR_REPO_METADATA_ACTION,
  LOAD_VISIBLE_ASSETS_ACTION,
  LOAD_ALL_ASSETS_ACTION,
  LOAD_ONLY_VISIBLE_ASSETS_ACTION,
  LOAD_ASSETS_FOR_USER_ACTION,
} from '../actions/assetRepoActions';

const initialState = {
  fetching: false,
  value: {
    createdAssetId: null,
    assets: [],
  },
  error: null,
};

export function addNewAssets(oldAssets, newAssets) {
  if (!oldAssets || oldAssets.length === 0) { return newAssets; }
  if (!newAssets || newAssets.length === 0) { return oldAssets; }

  const oldAssetIds = oldAssets.map(asset => asset.assetId);
  const brandNewAssets = newAssets.filter(newAsset => !oldAssetIds.includes(newAsset.assetId));
  return [
    ...oldAssets,
    ...brandNewAssets,
  ];
}

export default typeToReducer({
  [ADD_REPO_METADATA_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, value: state.value, fetching: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, value: state.value, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: { ...state.value, createdAssetId: action.payload } }),
  },
  [CLEAR_REPO_METADATA_ACTION]: state => ({ ...initialState, value: { ...state.value, createdAssetId: null } }),
  [LOAD_VISIBLE_ASSETS_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, value: state.value, fetching: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, value: state.value, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: { ...state.value, assets: addNewAssets(state.value.assets, action.payload) } }),
  },
  [LOAD_ALL_ASSETS_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, value: state.value, fetching: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, value: state.value, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: { ...state.value, assets: action.payload } }),
  },
  [LOAD_ONLY_VISIBLE_ASSETS_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, value: state.value, fetching: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, value: state.value, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: { ...state.value, assets: action.payload } }),
  },
  [LOAD_ASSETS_FOR_USER_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, value: state.value, fetching: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, value: state.value, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: { ...state.value, assets: action.payload } }),
  },
}, initialState);
