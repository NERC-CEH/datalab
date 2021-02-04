import { PROMISE_TYPE_FAILURE, PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS } from '../actions/actionTypes';
import { ADD_REPO_METADATA_ACTION, CLEAR_REPO_METADATA_ACTION } from '../actions/assetRepoActions';
import assetRepoReducer from './assetRepoReducer';

describe('assetRepoReducers', () => {
  describe('ADD_REPO_METADATA_ACTION', () => {
    it('should handle ADD_REPO_METADATA_ACTION_PENDING', () => {
      // Arrange
      const type = `${ADD_REPO_METADATA_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextState = assetRepoReducer({ error: null, fetching: false, value: null }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: true, value: null });
    });

    it('should handle ADD_REPO_METADATA_ACTION_SUCCESS', () => {
      // Arrange
      const type = `${ADD_REPO_METADATA_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = 'asset-1234';
      const action = { type, payload };

      // Act
      const nextState = assetRepoReducer({ error: null, fetching: false, value: null }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: false, value: { createdAssetId: action.payload } });
    });

    it('should handle ADD_REPO_METADATA_ACTION_FAILURE', () => {
      // Arrange
      const type = `${ADD_REPO_METADATA_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextState = assetRepoReducer({ error: null, fetching: false, value: null }, action);

      // Assert
      expect(nextState).toEqual({ error: payload, fetching: false, value: null });
    });
  });

  describe('CLEAR_REPO_METADATA_ACTION', () => {
    it('should result in initial state being set', () => {
      // Arrange
      const type = `${CLEAR_REPO_METADATA_ACTION}`;
      const action = { type };

      // Act
      const nextState = assetRepoReducer(
        { error: null, fetching: false, value: { createdAssetId: 'asset-1234', remainder: 'stuff' } },
        action,
      );

      // Assert
      expect(nextState).toEqual({ error: null, fetching: false, value: { createdAssetId: null, remainder: 'stuff' } });
    });
  });
});
