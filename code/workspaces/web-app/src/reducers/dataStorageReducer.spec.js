import dataStorageReducer from './dataStorageReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { LOAD_DATASTORAGE_ACTION } from '../actions/dataStorageActions';

describe('dataStorageReducer', () => {
  it('should return the initial state', () => {
    // Act/Assert
    expect(dataStorageReducer(undefined, {})).toEqual({ fetching: false, value: [], error: null });
  });

  it('should handle LOAD_DATASTORAGE_PENDING', () => {
    // Arrange
    const type = `${LOAD_DATASTORAGE_ACTION}_${PROMISE_TYPE_PENDING}`;
    const action = { type };

    // Act
    const nextstate = dataStorageReducer({ error: null, fetching: false, value: [] }, action);

    // Assert
    expect(nextstate).toEqual({ error: null, fetching: true, value: [] });
  });

  it('should handle LOAD_DATASTORAGE_SUCCESS', () => {
    // Arrange
    const type = `${LOAD_DATASTORAGE_ACTION}_${PROMISE_TYPE_SUCCESS}`;
    const payload = [{ dataStorage: 'firstStore' }, { dataStorage: 'secondStore' }];
    const action = { type, payload };

    // Act
    const nextstate = dataStorageReducer({ error: null, fetching: false, value: [] }, action);

    // Assert
    expect(nextstate).toEqual({ error: null, fetching: false, value: payload });
  });

  it('should handle LOAD_DATASTORAGE_FAILURE', () => {
    // Arrange
    const type = `${LOAD_DATASTORAGE_ACTION}_${PROMISE_TYPE_FAILURE}`;
    const payload = 'example error';
    const action = { type, payload };

    // Act
    const nextstate = dataStorageReducer({ error: null, fetching: false, value: [] }, action);

    // Assert
    expect(nextstate).toEqual({ error: payload, fetching: false, value: [] });
  });
});
