import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import {
  USER_LOGIN,
  GET_USER_PERMISSIONS,
} from '../actions/authActions';

const identityInitialState = {
  fetching: false,
  error: null,
  value: [],
};

const initialState = {
  permissions: identityInitialState,
  tokens: {},
  identity: {},
};

export default typeToReducer({
  [USER_LOGIN]: (state, action) => ({
    ...initialState,
    tokens: processTokens(action.payload),
    identity: processIdentity(action.payload),
  }),
  [GET_USER_PERMISSIONS]: {
    [PROMISE_TYPE_PENDING]: state => ({
      ...state,
      permissions: {
        ...identityInitialState,
        fetching: true,
      } }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({
      ...state,
      permissions: {
        ...identityInitialState,
        fetching: false,
        error: action.payload,
      } }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({
      ...state,
      permissions: {
        ...identityInitialState,
        fetching: false,
        value: action.payload,
      } }),
  },
}, initialState);

function processTokens(authResponse) {
  return {
    accessToken: authResponse.accessToken,
    expiresAt: authResponse.expiresAt,
    idToken: authResponse.idToken,
  };
}

function processIdentity({ identity }) {
  return identity ? JSON.parse(identity) : {};
}
