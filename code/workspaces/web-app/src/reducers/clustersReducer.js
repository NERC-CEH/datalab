import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import { LOAD_CLUSTERS_ACTION, UPDATE_CLUSTERS_ACTION } from '../actions/clusterActions';
import replaceProjectCategoryItems from './replaceProjectCategoryItems';
import { GET_ALL_PROJECTS_AND_RESOURCES_ACTION } from '../actions/projectActions';

const initialState = {
  fetching: false, // for calling query for first time
  updating: false, // for calling query again to get updated statuses
  value: [],
  error: null,
};

export default typeToReducer({
  [LOAD_CLUSTERS_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, fetching: true, value: state.value }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: replaceProjectCategoryItems(state.value, action.payload.projectKey, undefined, action.payload.clusters) }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, value: state.value, error: action.payload }),
  },
  [UPDATE_CLUSTERS_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, updating: true, value: state.value }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: replaceProjectCategoryItems(state.value, action.payload.projectKey, undefined, action.payload.clusters) }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, value: state.value, error: action.payload }),
  },
  [GET_ALL_PROJECTS_AND_RESOURCES_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, fetching: true, value: state.value }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: action.payload.clusters }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, value: state.value, error: action.payload }),
  },
}, initialState);
