import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import { PING_ACTION } from '../actions/pingActions';

const initialState = {
  fetching: false,
  value: null,
  error: null,
};

export default typeToReducer({
  [PING_ACTION]: {
    [PROMISE_TYPE_PENDING]: () => ({ ...initialState, fetching: true }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: action.payload }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload }),
  },
}, initialState);
