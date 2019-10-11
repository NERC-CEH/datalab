import stacksReducer from './stacksReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import {
  LOAD_STACKS_ACTION,
  LOAD_STACKS_BY_CATEGORY_ACTION,
  UPDATE_STACKS_ACTION,
  UPDATE_STACKS_BY_CATEGORY_ACTION,
} from '../actions/stackActions';

describe('stacksReducer', () => {
  it('should return the initial state when previous state undefined', () => {
    // Act/Assert
    expect(stacksReducer(undefined, {})).toEqual({ fetching: false, updating: false, value: [], error: null });
  });

  describe('it should handle LOAD_STACKS', () => {
    it('PENDING', () => {
      // Arrange
      const type = `${LOAD_STACKS_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: undefined }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, updating: false, value: [] });
    });

    it('SUCCESS', () => {
      // Arrange
      const type = `${LOAD_STACKS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = [{ notebook: 'firstStore' }, { notebook: 'secondStore' }];
      const action = { type, payload };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: undefined }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: false, value: payload });
    });

    it('FAILURE', () => {
      // Arrange
      const type = `${LOAD_STACKS_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: undefined }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, updating: false, value: [] });
    });
  });

  describe('it should handle LOAD_STACKS_BY_CATEGORY', () => {
    it('PENDING', () => {
      // Arrange
      const type = `${LOAD_STACKS_BY_CATEGORY_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: undefined }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, updating: false, value: [] });
    });

    it('SUCCESS', () => {
      // Arrange
      const type = `${LOAD_STACKS_BY_CATEGORY_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = [{ notebook: 'firstStore' }, { notebook: 'secondStore' }];
      const action = { type, payload };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: undefined }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: false, value: payload });
    });

    it('FAILURE', () => {
      // Arrange
      const type = `${LOAD_STACKS_BY_CATEGORY_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: undefined }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, updating: false, value: [] });
    });
  });

  describe('should handle UPDATE_STACKS', () => {
    it('PENDING', () => {
      // Arrange
      const type = `${UPDATE_STACKS_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: undefined }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: true, value: [] });
    });

    it('SUCCESS', () => {
      // Arrange
      const type = `${UPDATE_STACKS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = [{ notebook: 'firstStore' }, { notebook: 'secondStore' }];
      const action = { type, payload };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: undefined }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: false, value: payload });
    });

    it('FAILURE', () => {
      // Arrange
      const type = `${UPDATE_STACKS_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: undefined }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, updating: false, value: [] });
    });
  });

  describe('should handle UPDATE_STACKS_BY_CATEGORY', () => {
    it('PENDING', () => {
      // Arrange
      const type = `${UPDATE_STACKS_BY_CATEGORY_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: undefined }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: true, value: [] });
    });

    it('SUCCESS', () => {
      // Arrange
      const type = `${UPDATE_STACKS_BY_CATEGORY_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = [{ notebook: 'firstStore' }, { notebook: 'secondStore' }];
      const action = { type, payload };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: undefined }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: false, value: payload });
    });

    it('FAILURE', () => {
      // Arrange
      const type = `${UPDATE_STACKS_BY_CATEGORY_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: undefined }, action);

      // Assert
      expect(nextstate).toEqual({ error: payload, fetching: false, updating: false, value: [] });
    });
  });
});
