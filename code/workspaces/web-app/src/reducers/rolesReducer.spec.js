import rolesReducer from './rolesReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { GET_ALL_USERS_AND_ROLES_ACTION } from '../actions/roleActions';

describe('rolesReducer', () => {
  it('should return the initial state', () => {
    // Act/Assert
    expect(rolesReducer(undefined, {})).toEqual({
      fetching: false,
      value: [],
      error: null,
    });
  });

  describe('GET_ALL_USERS_AND_ROLES_ACTION', () => {
    it('should handle GET_ALL_USERS_AND_ROLES_ACTION_PENDING', () => {
      // Arrange
      const type = `${GET_ALL_USERS_AND_ROLES_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = rolesReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, value: [] });
    });

    it('should handle GET_ALL_USERS_AND_ROLES_ACTION_SUCCESS', () => {
      // Arrange
      const type = `${GET_ALL_USERS_AND_ROLES_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = ['payload'];
      const action = { type, payload };

      // Act
      const nextstate = rolesReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, value: action.payload });
    });

    it('should handle GET_ALL_USERS_AND_ROLES_ACTION_FAILURE', () => {
      // Arrange
      const type = `${GET_ALL_USERS_AND_ROLES_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = rolesReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, value: [] });
    });
  });
});
