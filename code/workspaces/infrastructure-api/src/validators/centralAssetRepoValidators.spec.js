import * as expressValidator from 'express-validator';
import ValidationChainHelper from './ValidationChainHelper';
import { assetIdValidator } from './centralAssetRepoValidators';

const bodyMock = jest
  .spyOn(expressValidator, 'body');

const mockHelperChainMethod = () => jest.fn().mockImplementation(() => mockHelperChain);
const mockHelperChain = {
  exists: mockHelperChainMethod(),
  getValidationChain: mockHelperChainMethod(),
  isUUIDv4: mockHelperChainMethod(),
};
jest.mock('./ValidationChainHelper');
ValidationChainHelper.mockImplementation(() => (mockHelperChain));

describe('clusterValidators', () => {
  describe('calls helper methods with correct argument on internal validation chain', () => {
    it('assetIdValidator', () => {
      assetIdValidator(expressValidator.body);
      expect(bodyMock).toHaveBeenCalledWith('assetId');
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
      expect(mockHelperChain.isUUIDv4).toHaveBeenCalled();
    });
  });
});
