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
