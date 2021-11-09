import assetRepoActions, { ADD_REPO_METADATA_ACTION, EDIT_REPO_METADATA_ACTION, CLEAR_REPO_METADATA_ACTION } from './assetRepoActions';
import assetRepoService from '../api/assetRepoService';

jest.mock('../api/assetRepoService');

describe('assetRepoActions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('calls correct service for', () => {
    it('addRepoMetadata', () => {
      // Arrange
      const addRepoMetadataMock = jest.fn().mockReturnValue('expectedPayload');
      assetRepoService.addRepoMetadata = addRepoMetadataMock;

      // Act
      const output = assetRepoActions.addRepoMetadata();

      // Assert
      expect(addRepoMetadataMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('ADD_REPO_METADATA_ACTION');
      expect(output.payload).toBe('expectedPayload');
    });

    it('editRepoMetadata', () => {
      // Arrange
      const editRepoMetadataMock = jest.fn().mockReturnValue('expectedPayload');
      assetRepoService.editRepoMetadata = editRepoMetadataMock;

      // Act
      const output = assetRepoActions.editRepoMetadata();

      // Assert
      expect(editRepoMetadataMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('EDIT_REPO_METADATA_ACTION');
      expect(output.payload).toBe('expectedPayload');
    });

    it('loadVisibleAssets', () => {
      // Arrange
      const loadVisibleAssetsMock = jest.fn().mockReturnValue('expectedPayload');
      assetRepoService.loadVisibleAssets = loadVisibleAssetsMock;

      // Act
      const output = assetRepoActions.loadVisibleAssets();

      // Assert
      expect(loadVisibleAssetsMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('LOAD_VISIBLE_ASSETS_ACTION');
      expect(output.payload).toBe('expectedPayload');
    });

    it('loadAllAssets', () => {
      // Arrange
      const loadAllAssetsMock = jest.fn().mockReturnValue('expectedPayload');
      assetRepoService.loadAllAssets = loadAllAssetsMock;

      // Act
      const output = assetRepoActions.loadAllAssets();

      // Assert
      expect(loadAllAssetsMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('LOAD_ALL_ASSETS_ACTION');
      expect(output.payload).toBe('expectedPayload');
    });

    it('loadOnlyVisibleAssets', () => {
      // Arrange
      const loadVisibleAssetsMock = jest.fn().mockReturnValue('expectedPayload');
      assetRepoService.loadVisibleAssets = loadVisibleAssetsMock;

      // Act
      const output = assetRepoActions.loadOnlyVisibleAssets();

      // Assert
      expect(loadVisibleAssetsMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('LOAD_ONLY_VISIBLE_ASSETS_ACTION');
      expect(output.payload).toBe('expectedPayload');
    });

    it('loadAssetsForUser', () => {
      // Arrange
      const loadAssetsForUserMock = jest.fn().mockReturnValue('expectedPayload');
      assetRepoService.loadAssetsForUser = loadAssetsForUserMock;

      // Act
      const output = assetRepoActions.loadAssetsForUser();

      // Assert
      expect(loadAssetsForUserMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('LOAD_ASSETS_FOR_USER_ACTION');
      expect(output.payload).toBe('expectedPayload');
    });

    describe('exports correct value for', () => {
      it('ADD_REPO_METADATA_ACTION', () => {
        expect(ADD_REPO_METADATA_ACTION).toBe('ADD_REPO_METADATA_ACTION');
      });
      it('EDIT_REPO_METADATA_ACTION', () => {
        expect(EDIT_REPO_METADATA_ACTION).toBe('EDIT_REPO_METADATA_ACTION');
      });
      it('CLEAR_REPO_METADATA_ACTION', () => {
        expect(CLEAR_REPO_METADATA_ACTION).toBe('CLEAR_REPO_METADATA_ACTION');
      });
    });
  });
});
