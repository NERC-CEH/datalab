import dataStoreReducer from './dataStoreReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { LOAD_DATASTORE_ACTION } from '../actions/dataStorageActions';

describe('dataStoreReducer', () => {
  it('should return the initial state', () => {
    // Act/Assert
    expect(dataStoreReducer(undefined, {})).toEqual({ fetching: false, value: undefined, error: null });
  });

  it('should handle LOAD_DATASTORE_PENDING', () => {
    // Arrange
    const type = `${LOAD_DATASTORE_ACTION}_${PROMISE_TYPE_PENDING}`;
    const action = { type };

    // Act
    const nextstate = dataStoreReducer({ error: null, fetching: false, value: undefined }, action);

    // Assert
    expect(nextstate).toEqual({ error: null, fetching: true, value: undefined });
  });

  it('should handle LOAD_DATASTORE_SUCCESS', () => {
    // Arrange
    const type = `${LOAD_DATASTORE_ACTION}_${PROMISE_TYPE_SUCCESS}`;
    const payload = [{ dataStore: 'firstStore' }, { dataStore: 'secondStore' }];
    const action = { type, payload };

    // Act
    const nextstate = dataStoreReducer({ error: null, fetching: false, value: undefined }, action);

    // Assert
    expect(nextstate).toEqual({ error: null, fetching: false, value: payload });
  });

  it('should handle LOAD_DATASTORE_FAILURE', () => {
    // Arrange
    const type = `${LOAD_DATASTORE_ACTION}_${PROMISE_TYPE_FAILURE}`;
    const payload = 'example error';
    const action = { type, payload };

    // Act
    const nextstate = dataStoreReducer({ error: null, fetching: false, value: undefined }, action);

    // Assert
    expect(nextstate).toEqual({ error: payload, fetching: false, value: undefined });
  });
});
