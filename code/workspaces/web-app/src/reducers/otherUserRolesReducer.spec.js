import otherUserRolesReducer from './otherUserRolesReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { GET_OTHER_USER_ROLES_ACTION } from '../actions/otherUserRolesActions';

describe('otherUserRolesReducer', () => {
  it('should return the initial state', () => {
    // Act/Assert
    expect(otherUserRolesReducer(undefined, {})).toEqual({ fetching: false, value: {}, error: null });
  });

  it('should handle GET_OTHER_USER_ROLES_PENDING', () => {
    // Arrange
    const type = `${GET_OTHER_USER_ROLES_ACTION}_${PROMISE_TYPE_PENDING}`;
    const action = { type };

    // Act
    const nextstate = otherUserRolesReducer({ error: null, fetching: false, value: {} }, action);

    // Assert
    expect(nextstate).toEqual({ error: null, fetching: true, value: {} });
  });

  it('should handle GET_OTHER_USER_ROLES_SUCESS', () => {
    // Arrange
    const type = `${GET_OTHER_USER_ROLES_ACTION}_${PROMISE_TYPE_SUCCESS}`;
    const otherUserRoles = { instanceAdmin: true };
    const payload = { userId: 'user1', otherUserRoles };
    const action = { type, payload };

    // Act
    const nextstate = otherUserRolesReducer({ error: null, fetching: true, value: {} }, action);

    // Assert
    expect(nextstate).toEqual({ error: null, fetching: false, value: { user1: otherUserRoles } });
  });

  it('should handle GET_OTHER_USER_ROLES_FAILURE', () => {
    // Arrange
    const type = `${GET_OTHER_USER_ROLES_ACTION}_${PROMISE_TYPE_FAILURE}`;
    const payload = 'example error';
    const action = { type, payload };

    // Act
    const nextstate = otherUserRolesReducer({ error: null, fetching: false, value: {} }, action);

    // Assert
    expect(nextstate).toEqual({ error: payload, fetching: false, value: {} });
  });
});
