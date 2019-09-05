import typeToReducer from 'type-to-reducer';
import { GET_PROJECT_USER_PERMISSIONS_ACTION } from '../actions/projectSettingsActions';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';

const initialState = {
  fetching: false,
  value: [],
  error: null,
};

export default typeToReducer({
  [GET_PROJECT_USER_PERMISSIONS_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({
      ...state,
      fetching: true,
      error: null,
    }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({
      ...initialState,
      value: action.payload,
    }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({
      ...initialState,
      value: action.payload,
      error: true,
    }),
  },
}, initialState);
