import * as expressValidator from 'express-validator';
import ValidationChainHelper from './ValidationChainHelper';
import { clusterTypeValidator, mountValidator } from './clusterValidators';

const bodyMock = jest
  .spyOn(expressValidator, 'body');

const mockHelperChainMethod = () => jest.fn().mockImplementation(() => mockHelperChain);
const mockHelperChain = {
  exists: mockHelperChainMethod(),
  getValidationChain: mockHelperChainMethod(),
  isIn: mockHelperChainMethod(),
};
jest.mock('./ValidationChainHelper');
ValidationChainHelper.mockImplementation(() => (mockHelperChain));

describe('clusterValidators', () => {
  describe('calls helper methods with correct argument on internal validation chain', () => {
    it('clusterTypeValidator', () => {
      clusterTypeValidator(expressValidator.body);
      expect(bodyMock).toHaveBeenCalledWith('type');
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
      expect(mockHelperChain.isIn).toHaveBeenCalledWith(['DASK', 'SPARK']);
    });

    it('mountValidator', () => {
      mountValidator(expressValidator.body);
      expect(bodyMock).toHaveBeenCalledWith('volumeMount');
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
    });
  });
});
