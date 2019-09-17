import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import {
  LOAD_PROJECTS_ACTION, LOAD_PROJECTINFO_ACTION,
} from '../actions/projectActions';

const initialState = {
  fetching: false,
  value: {},
  error: null,
};

export default typeToReducer({
  [LOAD_PROJECTS_ACTION]: {
    [PROMISE_TYPE_PENDING]: () => ({ ...initialState, fetching: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: { projectArray: action.payload } }),
  },
  [LOAD_PROJECTINFO_ACTION]: {
    [PROMISE_TYPE_PENDING]: () => ({ ...initialState, fetching: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: action.payload }),
  },
}, { ...initialState });
