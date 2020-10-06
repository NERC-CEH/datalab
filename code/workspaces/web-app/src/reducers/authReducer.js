import typeToReducer from 'type-to-reducer';
import {
  PROMISE_TYPE_PENDING,
  PROMISE_TYPE_SUCCESS,
  PROMISE_TYPE_FAILURE,
} from '../actions/actionTypes';
import {
  USER_LOGIN_ACTION,
  GET_USER_PERMISSIONS_ACTION,
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
  [USER_LOGIN_ACTION]: (state, action) => ({
    ...initialState,
    tokens: processTokens(action.payload),
    identity: processIdentity(action.payload),
  }),
  [GET_USER_PERMISSIONS_ACTION]: {
    [PROMISE_TYPE_PENDING]: state => ({
      ...state,
      permissions: {
        ...identityInitialState,
        fetching: true,
      },
    }),
    [PROMISE_TYPE_FAILURE]: (state, action) => ({
      ...state,
      permissions: {
        ...identityInitialState,
        fetching: false,
        error: action.payload,
      },
    }),
    [PROMISE_TYPE_SUCCESS]: (state, action) => ({
      ...state,
      permissions: {
        ...identityInitialState,
        fetching: false,
        value: action.payload,
      },
    }),
  },
}, initialState);

function processTokens(authResponse) {
  return {
    access_token: authResponse.access_token,
    expires_at: authResponse.expires_at,
    id_token: authResponse.id_token,
  };
}

function processIdentity({ identity }) {
  return identity ? JSON.parse(identity) : {};
}
