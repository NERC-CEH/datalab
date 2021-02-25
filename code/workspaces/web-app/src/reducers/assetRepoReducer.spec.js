import { PROMISE_TYPE_FAILURE, PROMISE_TYPE_PENDING, PROMISE_TYPE_SUCCESS } from '../actions/actionTypes';
import { ADD_REPO_METADATA_ACTION, CLEAR_REPO_METADATA_ACTION, LOAD_VISIBLE_ASSETS_ACTION, LOAD_ALL_ASSETS_ACTION } from '../actions/assetRepoActions';
import assetRepoReducer, { addNewAssets } from './assetRepoReducer';

describe('assetRepoReducer', () => {
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

  describe('LOAD_VISIBLE_ASSETS_ACTION', () => {
    it('should handle LOAD_VISIBLE_ASSETS_ACTION_PENDING', () => {
      // Arrange
      const type = `${LOAD_VISIBLE_ASSETS_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextState = assetRepoReducer({ error: null, fetching: false, value: null }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: true, value: null });
    });

    it('should handle LOAD_VISIBLE_ASSETS_ACTION_SUCCESS', () => {
      // Arrange
      const type = `${LOAD_VISIBLE_ASSETS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = [{ assetId: 'asset-1234' }];
      const action = { type, payload };

      // Act
      const nextState = assetRepoReducer({ error: null, fetching: false, value: { assets: [] } }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: false, value: { assets: action.payload } });
    });

    it('should handle LOAD_VISIBLE_ASSETS_ACTION_FAILURE', () => {
      // Arrange
      const type = `${LOAD_VISIBLE_ASSETS_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextState = assetRepoReducer({ error: null, fetching: false, value: null }, action);

      // Assert
      expect(nextState).toEqual({ error: payload, fetching: false, value: null });
    });
  });

  describe('LOAD_ALL_ASSETS_ACTION', () => {
    it('should handle LOAD_ALL_ASSETS_ACTION_PENDING', () => {
      // Arrange
      const type = `${LOAD_ALL_ASSETS_ACTION}_${PROMISE_TYPE_PENDING}`;
      const action = { type };

      // Act
      const nextState = assetRepoReducer({ error: null, fetching: false, value: null }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: true, value: null });
    });

    it('should handle LOAD_ALL_ASSETS_ACTION_ACTION_SUCCESS', () => {
      // Arrange
      const type = `${LOAD_ALL_ASSETS_ACTION}_${PROMISE_TYPE_SUCCESS}`;
      const payload = [{ assetId: 'asset-1234' }];
      const action = { type, payload };

      // Act
      const nextState = assetRepoReducer({ error: null, fetching: false, value: { assets: [] } }, action);

      // Assert
      expect(nextState).toEqual({ error: null, fetching: false, value: { assets: action.payload } });
    });

    it('should handle LOAD_ALL_ASSETS_ACTION_FAILURE', () => {
      // Arrange
      const type = `${LOAD_ALL_ASSETS_ACTION}_${PROMISE_TYPE_FAILURE}`;
      const payload = 'example error';
      const action = { type, payload };

      // Act
      const nextState = assetRepoReducer({ error: null, fetching: false, value: null }, action);

      // Assert
      expect(nextState).toEqual({ error: payload, fetching: false, value: null });
    });
  });
});

describe('addNewAssets', () => {
  it('only adds brand new assets', () => {
    // Arrange
    const asset1 = { assetId: 'asset-1', name: 'name 1' };
    const asset2 = { assetId: 'asset-2', name: 'name 2' };
    const asset3 = { assetId: 'asset-3', name: 'name 3' };
    const oldAssets = [asset1, asset2];
    const newAssets = [asset2, asset3];

    // Act
    const sumAssets = addNewAssets(oldAssets, newAssets);

    // Assert - should not get asset2 twice
    expect(sumAssets).toEqual([asset1, asset2, asset3]);
  });
});
