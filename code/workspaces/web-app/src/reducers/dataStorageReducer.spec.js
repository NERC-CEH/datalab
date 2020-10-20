import { GLUSTERFS_VOLUME } from 'common/src/stackTypes';
import dataStorageReducer from './dataStorageReducer';
import { PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS, PROMISE_TYPE_FAILURE } from '../actions/actionTypes';
import { LOAD_DATASTORAGE_ACTION } from '../actions/dataStorageActions';

const currentValue = [
  { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeA' },
  { projectKey: 'proj2', type: GLUSTERFS_VOLUME, store: 'proj2.storeA' },
];
const valuePayload = [
  { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeA' },
  { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeB' },
];
const replaceProjectNextValue = [
  { projectKey: 'proj2', type: GLUSTERFS_VOLUME, store: 'proj2.storeA' },
  { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeA' },
  { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeB' },
];
const error = 'example error';

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
    const nextstate = dataStorageReducer({ error: null, fetching: false, value: currentValue }, action);

    // Assert
    expect(nextstate).toEqual({ error: null, fetching: true, value: currentValue });
  });

  it('should handle LOAD_DATASTORAGE_SUCCESS', () => {
    // Arrange
    const type = `${LOAD_DATASTORAGE_ACTION}_${PROMISE_TYPE_SUCCESS}`;
    const action = { type, payload: valuePayload };

    // Act
    const nextstate = dataStorageReducer({ error: null, fetching: false, value: currentValue }, action);

    // Assert
    expect(nextstate).toEqual({ error: null, fetching: false, value: replaceProjectNextValue });
  });

  it('should handle LOAD_DATASTORAGE_FAILURE', () => {
    // Arrange
    const type = `${LOAD_DATASTORAGE_ACTION}_${PROMISE_TYPE_FAILURE}`;
    const action = { type, payload: error };

    // Act
    const nextstate = dataStorageReducer({ error: null, fetching: false, value: currentValue }, action);

    // Assert
    expect(nextstate).toEqual({ error, fetching: false, value: [] });
  });
});
