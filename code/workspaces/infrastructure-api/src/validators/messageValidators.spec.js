import * as expressValidator from 'express-validator';
import ValidationChainHelper from './ValidationChainHelper';
import validators from './messageValidators';

const bodyMock = jest
  .spyOn(expressValidator, 'body');

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
    it('messageValidator', () => {
      validators.messageValidator(expressValidator.body);
      expect(bodyMock).toHaveBeenCalledWith('message');
      expect(bodyMock).toHaveBeenCalledWith('expiry');
      expect(mockHelperChain.exists).toHaveBeenCalledTimes(2);
      expect(mockHelperChain.notEmpty).toHaveBeenCalledTimes(2);
    });
  });
});
