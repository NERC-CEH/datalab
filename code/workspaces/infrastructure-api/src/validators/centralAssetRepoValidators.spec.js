import * as expressValidator from 'express-validator';
import ValidationChainHelper from './ValidationChainHelper';
import { assetIdValidator, createValidator, updateValidator } from './centralAssetRepoValidators';

const bodyMock = jest
  .spyOn(expressValidator, 'body');

const mockHelperChainMethod = () => jest.fn().mockImplementation(() => mockHelperChain);
const mockHelperChain = {
  exists: mockHelperChainMethod(),
  getValidationChain: mockHelperChainMethod(),
  isArray: mockHelperChainMethod(),
  isIn: mockHelperChainMethod(),
  isUrl: mockHelperChainMethod(),
  isUUIDv4: mockHelperChainMethod(),
  optional: mockHelperChainMethod(),
  notEmpty: mockHelperChainMethod(),
};
jest.mock('./ValidationChainHelper');
ValidationChainHelper.mockImplementation(() => (mockHelperChain));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('centralAssetRepoValidators', () => {
  describe('calls helper methods with correct argument on internal validation chain', () => {
    it('assetIdValidator', () => {
      assetIdValidator(expressValidator.body);
      expect(bodyMock).toHaveBeenCalledWith('assetId');
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
      expect(mockHelperChain.isUUIDv4).toHaveBeenCalled();
    });
  });

  describe('calls validators for right parameters', () => {
    it('createValidator', () => {
      createValidator(expressValidator.body);
      expect(bodyMock.mock.calls).toEqual([['name'], ['version'], ['fileLocation'], ['masterUrl'], ['ownerUserIds'], ['visible'], ['projectKeys']]);
    });

    it('updateValidator', () => {
      updateValidator(expressValidator.body);
      expect(bodyMock.mock.calls).toEqual([['ownerUserIds'], ['visible'], ['projectKeys']]);
    });
  });
});
