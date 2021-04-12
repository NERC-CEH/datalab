import * as expressValidator from 'express-validator';
import { nameValidator, projectKeyValidator, optionalProjectKeyValidator } from './commonValidators';
import ValidationChainHelper from './ValidationChainHelper';

const paramMock = jest
  .spyOn(expressValidator, 'param');

const mockHelperChainMethod = () => jest.fn().mockImplementation(() => mockHelperChain);
const mockHelperChain = {
  exists: mockHelperChainMethod(),
  getValidationChain: mockHelperChainMethod(),
  isName: mockHelperChainMethod(),
  optional: mockHelperChainMethod(),
  notEmpty: mockHelperChainMethod(),
};
jest.mock('./ValidationChainHelper');
ValidationChainHelper.mockImplementation(() => (mockHelperChain));

describe('commonValidators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('calls helper methods with correct argument on internal validation chain', () => {
    it('nameValidator', () => {
      nameValidator(expressValidator.param);
      expect(paramMock).toHaveBeenCalledWith('name');
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
      expect(mockHelperChain.isName).toHaveBeenCalledWith();
    });
    it('projectKeyValidator', () => {
      projectKeyValidator(expressValidator.param);
      expect(paramMock).toHaveBeenCalledWith('projectKey');
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
      expect(mockHelperChain.notEmpty).toHaveBeenCalledWith();
    });
    it('optionalProjectKeyValidator', () => {
      optionalProjectKeyValidator(expressValidator.param);
      expect(paramMock).toHaveBeenCalledWith('projectKey');
      expect(mockHelperChain.optional).toHaveBeenCalledWith();
      expect(mockHelperChain.notEmpty).toHaveBeenCalledWith();
    });
  });
});
