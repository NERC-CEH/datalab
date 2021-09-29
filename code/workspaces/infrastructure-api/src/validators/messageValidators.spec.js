import * as expressValidator from 'express-validator';
import ValidationChainHelper from './ValidationChainHelper';
import { messageValidator, messageIdValidator } from './messageValidators';

const bodyMock = jest
  .spyOn(expressValidator, 'body');
const paramMock = jest
  .spyOn(expressValidator, 'param');

const mockHelperChainMethod = () => jest.fn().mockImplementation(() => mockHelperChain);
const mockHelperChain = {
  exists: mockHelperChainMethod(),
  getValidationChain: mockHelperChainMethod(),
  notEmpty: mockHelperChainMethod(),
};
jest.mock('./ValidationChainHelper');
ValidationChainHelper.mockImplementation(() => (mockHelperChain));

describe('messageValidators', () => {
  describe('calls helper methods with correct argument on internal validation chain', () => {
    beforeEach(() => jest.clearAllMocks());

    it('messageValidator', () => {
      messageValidator(expressValidator.body);
      expect(bodyMock).toHaveBeenCalledWith('message');
      expect(bodyMock).toHaveBeenCalledWith('expiry');
      expect(mockHelperChain.exists).toHaveBeenCalledTimes(2);
      expect(mockHelperChain.notEmpty).toHaveBeenCalledTimes(2);
    });

    it('messageIdValidator', () => {
      messageIdValidator(expressValidator.param);
      expect(paramMock).toHaveBeenCalledWith('id');
      expect(mockHelperChain.exists).toHaveBeenCalledTimes(1);
      expect(mockHelperChain.notEmpty).toHaveBeenCalledTimes(1);
    });
  });
});
