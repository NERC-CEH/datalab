import ValidationChainHelper from '../validators/ValidationChainHelper';
import { notificationValidator, notificationIdValidator } from './notificationValidators';

jest.mock('../validators/ValidationChainHelper');

describe('notificationValidators', () => {
  describe('calls helper methods with correct argument on internal validation chain', () => {
    let mockHelperChain;

    beforeEach(() => {
      const mockHelperChainMethod = () => jest.fn().mockImplementation(() => mockHelperChain);

      mockHelperChain = {
        exists: mockHelperChainMethod(),
        getValidationChain: mockHelperChainMethod(),
        notEmpty: mockHelperChainMethod(),
      };

      ValidationChainHelper.mockImplementation(() => mockHelperChain);
    });

    it('notificationValidator', () => {
      const bodyMock = jest.fn(() => mockHelperChain);
      notificationValidator(bodyMock);
      expect(bodyMock).toHaveBeenCalledWith('message');
      expect(bodyMock).toHaveBeenCalledWith('title');
      expect(bodyMock).toHaveBeenCalledWith('userIDs');
      expect(mockHelperChain.exists).toHaveBeenCalledTimes(3);
      expect(mockHelperChain.notEmpty).toHaveBeenCalledTimes(3);
    });

    it('notificationIdValidator', () => {
      const paramMock = jest.fn(() => mockHelperChain);
      notificationIdValidator(paramMock);
      expect(paramMock).toHaveBeenCalledWith('id');
      expect(mockHelperChain.exists).toHaveBeenCalledTimes(1);
      expect(mockHelperChain.notEmpty).toHaveBeenCalledTimes(1);
    });
  });
});
