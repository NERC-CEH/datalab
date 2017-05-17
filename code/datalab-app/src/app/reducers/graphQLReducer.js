import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import {
  GET_COUNT_ACTION,
  INCREMENT_COUNT_ACTION,
  RESET_COUNT_ACTION,
} from '../actions/graphQLActions';

const initialState = {
  fetching: false,
  value: null,
  error: null,
};

const promiseReducers = {
  [PROMISE_TYPE_PENDING]: () => ({ ...initialState, fetching: true }),
  [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: action.payload }),
  [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload }),
};

export default typeToReducer({
  [GET_COUNT_ACTION]: promiseReducers,
  [INCREMENT_COUNT_ACTION]: promiseReducers,
  [RESET_COUNT_ACTION]: promiseReducers,
}, initialState);
