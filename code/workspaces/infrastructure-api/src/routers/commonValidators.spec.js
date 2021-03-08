import { param, query } from 'express-validator';
import * as commonValidators from './commonValidators';
import ValidationChainHelper from '../controllers/utils/validationChainHelper';

jest.mock('express-validator');
param.mockImplementation(() => mockHelperChain);
query.mockImplementation(() => mockHelperChain);

const mockHelperChainMethod = () => jest.fn().mockImplementation(() => mockHelperChain);
const mockHelperChain = {
  exists: mockHelperChainMethod(),
  getValidationChain: mockHelperChainMethod(),
  notEmpty: mockHelperChainMethod(),
};
jest.mock('../controllers/utils/validationChainHelper');
ValidationChainHelper.mockImplementation(() => (mockHelperChain));

describe('commonValidators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('paramProjectKeyValidator', () => {
    it('calls helper methods with correct argument on internal validation chain', () => {
      commonValidators.paramProjectKeyValidator();
      expect(param).toHaveBeenCalledWith('projectKey');
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
      expect(mockHelperChain.notEmpty).toHaveBeenCalledWith();
    });
  });

  describe('queryProjectKeyValidator', () => {
    it('calls helper methods with correct argument on internal validation chain', () => {
      commonValidators.queryProjectKeyValidator();
      expect(query).toHaveBeenCalledWith('projectKey');
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
      expect(mockHelperChain.notEmpty).toHaveBeenCalledWith();
    });
  });
});
