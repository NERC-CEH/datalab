import authReducer from './authReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { USER_LOGIN_ACTION, GET_USER_PERMISSIONS_ACTION } from '../actions/authActions';

const initialState = {
  identity: {},
  permissions: {
    error: null,
    fetching: false,
    value: [],
  },
  tokens: {},
};

describe('authReducer', () => {
  it('returns the initial state', () =>
    expect(authReducer(undefined, {}))
      .toEqual(initialState));

  it('handles USER_LOGIN correctly', () => {
    // Arrange
    const type = USER_LOGIN_ACTION;
    const payload = {
      accessToken: 'expectedAccessToken',
      expiresAt: 'value',
      idToken: 'expectedIdToken',
      identity: '{"first":123,"second":"string"}',
    };
    const action = { type, payload };

    // Act
    const nextstate = authReducer(initialState, action);

    // Assert
    expect(nextstate.permissions).toEqual(initialState.permissions);
    expect(nextstate.tokens).toEqual({
      accessToken: payload.accessToken,
      expiresAt: payload.expiresAt,
      idToken: payload.idToken,
    });
    expect(nextstate.identity).toEqual({
      first: 123,
      second: 'string',
    });
  });

  it('handles GET_USER_PERMISSIONS_PENDING', () => {
    // Arrange
    const type = `${GET_USER_PERMISSIONS_ACTION}_${PROMISE_TYPE_PENDING}`;
    const action = { type };

    // Act
    const nextstate = authReducer(initialState, action);

    // Assert
    expect(nextstate).toEqual({
      ...initialState,
      permissions: {
        error: null,
        fetching: true,
        value: [],
      },
    });
  });

  it('handles GET_USER_PERMISSIONS_SUCCESS', () => {
    // Arrange
    const type = `${GET_USER_PERMISSIONS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
    const payload = ['permission1', 'permission2'];
    const action = { type, payload };

    // Act
    const nextstate = authReducer(initialState, action);

    // Assert
    expect(nextstate).toEqual({
      ...initialState,
      permissions: {
        error: null,
        fetching: false,
        value: payload,
      },
    });
  });

  it('handles GET_USER_PERMISSIONS_FAILURE', () => {
    // Arrange
    const type = `${GET_USER_PERMISSIONS_ACTION}_${PROMISE_TYPE_FAILURE}`;
    const payload = 'example error';
    const action = { type, payload };
    // Act
    const nextstate = authReducer(initialState, action);

    // Assert
    expect(nextstate).toEqual({
      ...initialState,
      permissions: {
        error: payload,
        fetching: false,
        value: [],
      },
    });
  });
});
