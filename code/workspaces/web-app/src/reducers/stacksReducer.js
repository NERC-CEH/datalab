import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import {
  LOAD_STACKS_ACTION, LOAD_STACKS_BY_CATEGORY_ACTION, UPDATE_STACKS_ACTION, UPDATE_STACKS_BY_CATEGORY_ACTION,
} from '../actions/stackActions';
import replaceProjectCategoryItems from './replaceProjectCategoryItems';

const initialState = {
  fetching: false, // for calling query for first time
  updating: false, // for calling query again to get updated statuses
  value: [],
  error: null,
};

export default typeToReducer({
  [LOAD_STACKS_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, value: [...state.value], fetching: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: action.payload }),
  },
  [LOAD_STACKS_BY_CATEGORY_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, value: [...state.value], fetching: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: replaceProjectCategoryItems(state.value, action.payload) }),
  },
  [UPDATE_STACKS_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, value: [...state.value], updating: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: action.payload }),
  },
  [UPDATE_STACKS_BY_CATEGORY_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, value: [...state.value], updating: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: replaceProjectCategoryItems(state.value, action.payload) }),
  },
}, initialState);
