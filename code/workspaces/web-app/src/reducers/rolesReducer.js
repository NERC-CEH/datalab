import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import { GET_ALL_USERS_AND_ROLES_ACTION } from '../actions/roleActions';

const initialState = {
  fetching: false,
  value: [],
  error: null,
};

export default typeToReducer({
  [GET_ALL_USERS_AND_ROLES_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({ ...initialState, fetching: true, value: state.value }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({ ...initialState, error: action.payload, value: state.value }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({ ...initialState, value: action.payload }),
  },
}, initialState);
