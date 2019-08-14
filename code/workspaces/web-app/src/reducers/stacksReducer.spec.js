import stacksReducer from './stacksReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { LOAD_STACKS_ACTION } from '../actions/stackActions';

describe('stacksReducer', () => {
  it('should return the initial state', () => {
    // Act/Assert
    expect(stacksReducer(undefined, {})).toEqual({ fetching: false, value: [], error: null });
  });

  it('should handle LOAD_NOTEBOOKS_PENDING', () => {
    // Arrange
    const type = `${LOAD_STACKS_ACTION}_${PROMISE_TYPE_PENDING}`;
    const action = { type };

    // Act
    const nextstate = stacksReducer({ error: null, fetching: false, value: undefined }, action);

    // Assert
    expect(nextstate).toEqual({ error: null, fetching: true, value: [] });
  });

  it('should handle LOAD_NOTEBOOKS_SUCCESS', () => {
    // Arrange
    const type = `${LOAD_STACKS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
    const payload = [{ notebook: 'firstStore' }, { notebook: 'secondStore' }];
    const action = { type, payload };

    // Act
    const nextstate = stacksReducer({ error: null, fetching: false, value: undefined }, action);

    // Assert
    expect(nextstate).toEqual({ error: null, fetching: false, value: payload });
  });

  it('should handle LOAD_NOTEBOOKS_FAILURE', () => {
    // Arrange
    const type = `${LOAD_STACKS_ACTION}_${PROMISE_TYPE_FAILURE}`;
    const payload = 'example error';
    const action = { type, payload };

    // Act
    const nextstate = stacksReducer({ error: null, fetching: false, value: undefined }, action);

    // Assert
    expect(nextstate).toEqual({ error: payload, fetching: false, value: [] });
  });
});
