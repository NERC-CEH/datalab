import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import {
  LIST_USERS_ACTION,
} from '../actions/userActions';

const initialState = {
  fetching: false,
  value: [],
  error: null,
};

export default typeToReducer({
  [LIST_USERS_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, value: state.value, fetching: true }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: action.payload }),
  },
}, initialState);
