import ValidationChainHelper from './ValidationChainHelper';
import { messageValidator, messageIdValidator } from './messageValidators';

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
      const bodyMock = jest.fn(() => mockHelperChain);

      messageValidator(bodyMock);
      expect(bodyMock).toHaveBeenCalledWith('message');
      expect(bodyMock).toHaveBeenCalledWith('expiry');
      expect(mockHelperChain.exists).toHaveBeenCalledTimes(2);
      expect(mockHelperChain.notEmpty).toHaveBeenCalledTimes(2);
    });

    it('messageIdValidator', () => {
      const paramMock = jest.fn(() => mockHelperChain);

      messageIdValidator(paramMock);
      expect(paramMock).toHaveBeenCalledWith('id');
      expect(mockHelperChain.exists).toHaveBeenCalledTimes(1);
      expect(mockHelperChain.notEmpty).toHaveBeenCalledTimes(1);
    });
  });
});
