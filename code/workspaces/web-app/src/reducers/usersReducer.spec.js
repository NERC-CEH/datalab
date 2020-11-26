import userReducer from './usersReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { LIST_USERS_ACTION } from '../actions/userActions';
import { GET_ALL_USERS_AND_ROLES_ACTION } from '../actions/roleActions';

describe('userReducer', () => {
  it('should return the initial state', () => {
    // Act/Assert
    expect(userReducer(undefined, {})).toEqual({ fetching: false, value: [], error: null });
  });

  describe('LIST_USERS_ACTION', () => {
    it('should handle LIST_USERS_PENDING', () => {
    // Arrange
      const type = `${LIST_USERS_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = userReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, value: [] });
    });

    it('should handle LIST_USERS_SUCESS', () => {
    // Arrange
      const type = `${LIST_USERS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = [{ user: 'userOne' }, { user: 'userTwo' }];
      const action = { type, payload };

      // Act
      const nextstate = userReducer({ error: null, fetching: true, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, value: payload });
    });

    it('should handle LIST_USERS_FAILURE', () => {
    // Arrange
      const type = `${LIST_USERS_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = userReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, value: [] });
    });
  });

  describe('GET_ALL_USERS_AND_ROLES_ACTION', () => {
    it('should handle GET_ALL_USERS_AND_ROLES_ACTION_PENDING', () => {
      // Arrange
      const type = `${GET_ALL_USERS_AND_ROLES_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = userReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, value: [] });
    });

    it('should handle GET_ALL_USERS_AND_ROLES_ACTION_SUCESS', () => {
      // Arrange
      const type = `${GET_ALL_USERS_AND_ROLES_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = [{ name: 'userOne', userId: 'user-1' }, { name: 'userTwo', userId: 'user-2' }];
      const action = { type, payload };

      // Act
      const nextstate = userReducer({ error: null, fetching: true, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, value: payload });
    });

    it('should handle GET_ALL_USERS_AND_ROLES_ACTION_FAILURE', () => {
      // Arrange
      const type = `${GET_ALL_USERS_AND_ROLES_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = userReducer({ error: null, fetching: false, value: [] }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, value: [] });
    });
  });
});
