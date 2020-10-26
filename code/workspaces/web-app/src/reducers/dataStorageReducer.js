import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import {
  LOAD_DATASTORAGE_ACTION,
} from '../actions/dataStorageActions';
import replaceProjectCategoryItems from './replaceProjectCategoryItems';

const initialState = {
  fetching: false,
  value: [],
  error: null,
};

export default typeToReducer({
  [LOAD_DATASTORAGE_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, value: state.value, fetching: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: replaceProjectCategoryItems(state.value, action.payload) }),
  },
}, initialState);
