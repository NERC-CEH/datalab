import { JUPYTER } from 'common/src/stackTypes';
import stacksReducer from './stacksReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import {
  LOAD_STACKS_ACTION,
  LOAD_STACKS_BY_CATEGORY_ACTION,
  UPDATE_STACKS_ACTION,
  UPDATE_STACKS_BY_CATEGORY_ACTION,
} from '../actions/stackActions';
import { GET_ALL_PROJECTS_AND_RESOURCES_ACTION } from '../actions/projectActions';

const currentValue = [
  { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackA' },
  { projectKey: 'proj2', type: JUPYTER, stack: 'proj2.stackA' },
];
const valuePayload = [
  { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackA' },
  { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackB' },
];
const replaceProjectNextValue = [
  { projectKey: 'proj2', type: JUPYTER, stack: 'proj2.stackA' },
  { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackA' },
  { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackB' },
];
const error = 'example error';

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
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, updating: false, value: currentValue });
    });

    it('SUCCESS', () => {
      // Arrange
      const type = `${LOAD_STACKS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const action = { type, payload: valuePayload };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: false, value: valuePayload });
    });

    it('FAILURE', () => {
      // Arrange
      const type = `${LOAD_STACKS_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const action = { type, payload: error };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error, fetching: false, updating: false, value: currentValue });
    });
  });

  describe('it should handle LOAD_STACKS_BY_CATEGORY', () => {
    it('PENDING', () => {
      // Arrange
      const type = `${LOAD_STACKS_BY_CATEGORY_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, updating: false, value: currentValue });
    });

    it('SUCCESS', () => {
      // Arrange
      const type = `${LOAD_STACKS_BY_CATEGORY_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const action = { type, payload: valuePayload };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: false, value: replaceProjectNextValue });
    });

    it('FAILURE', () => {
      // Arrange
      const type = `${LOAD_STACKS_BY_CATEGORY_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const action = { type, payload: error };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error, fetching: false, updating: false, value: currentValue });
    });
  });

  describe('should handle UPDATE_STACKS', () => {
    it('PENDING', () => {
      // Arrange
      const type = `${UPDATE_STACKS_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: true, value: currentValue });
    });

    it('SUCCESS', () => {
      // Arrange
      const type = `${UPDATE_STACKS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const action = { type, payload: valuePayload };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: false, value: valuePayload });
    });

    it('FAILURE', () => {
      // Arrange
      const type = `${UPDATE_STACKS_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const action = { type, payload: error };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error, fetching: false, updating: false, value: currentValue });
    });
  });

  describe('should handle UPDATE_STACKS_BY_CATEGORY', () => {
    it('PENDING', () => {
      // Arrange
      const type = `${UPDATE_STACKS_BY_CATEGORY_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: true, value: currentValue });
    });

    it('SUCCESS', () => {
      // Arrange
      const type = `${UPDATE_STACKS_BY_CATEGORY_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const action = { type, payload: valuePayload };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: false, value: replaceProjectNextValue });
    });

    it('FAILURE', () => {
      // Arrange
      const type = `${UPDATE_STACKS_BY_CATEGORY_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const action = { type, payload: error };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error, fetching: false, updating: false, value: currentValue });
    });
  });

  describe('should handle GET_ALL_PROJECTS_AND_RESOURCES_ACTION', () => {
    it('PENDING', () => {
      // Arrange
      const type = `${GET_ALL_PROJECTS_AND_RESOURCES_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: true, updating: false, value: currentValue });
    });

    it('SUCCESS', () => {
      // Arrange
      const type = `${GET_ALL_PROJECTS_AND_RESOURCES_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const action = { type, payload: { stacks: valuePayload } };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error: null, fetching: false, updating: false, value: valuePayload });
    });

    it('FAILURE', () => {
      // Arrange
      const type = `${GET_ALL_PROJECTS_AND_RESOURCES_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const action = { type, payload: error };

      // Act
      const nextstate = stacksReducer({ error: null, fetching: false, updating: false, value: currentValue }, action);

      // Assert
      expect(nextstate).toEqual({ error, fetching: false, updating: false, value: currentValue });
    });
  });
});
