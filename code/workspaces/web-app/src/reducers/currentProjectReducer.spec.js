import { SET_CURRENT_PROJECT_ACTION } from '../actions/projectActions';
import { PROMISE_TYPE_FAILURE, PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS } from '../actions/actionTypes';
import currentProjectsReducer from './currentProjectReducer';

describe('currentProjectReducers', () => {
  describe('SET_CURRENT_PROJECT', () => {
    it('should handle SET_CURRENT_PROJECT_PENDING', () => {
      // Arrange
      const type = `${SET_CURRENT_PROJECT_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = currentProjectsReducer({ error: null, fetching: false, value: {} }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, value: {} });
    });

    it('should handle SET_CURRENT_PROJECT_SUCCESS', () => {
      // Arrange
      const type = `${SET_CURRENT_PROJECT_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = { project: 'secondProject' };
      const action = { type, payload };

      // Act
      const nextstate = currentProjectsReducer({ error: null, fetching: false, value: {} }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, value: action.payload });
    });

    it('should handle SET_CURRENT_PROJECT_FAILURE', () => {
      // Arrange
      const type = `${SET_CURRENT_PROJECT_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = currentProjectsReducer({ error: null, fetching: false, value: {} }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, value: {} });
    });
  });
});
