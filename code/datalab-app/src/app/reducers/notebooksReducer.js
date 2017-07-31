import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import {
  LOAD_NOTEBOOKS_ACTION,
} from '../actions/notebookActions';

const initialState = {
  fetching: false,
  value: [],
  error: null,
};

export default typeToReducer({
  [LOAD_NOTEBOOKS_ACTION]: {
    [PROMISE_TYPE_PENDING]: () => ({ ...initialState, fetching: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: action.payload }),
  },
}, initialState);
