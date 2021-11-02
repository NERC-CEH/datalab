import * as expressValidator from 'express-validator';
import ValidationChainHelper from '../validators/ValidationChainHelper';
import { notificationValidator, notificationIdValidator } from './notificationValidators';

const bodyMock = jest.spyOn(expressValidator, 'body');
const paramMock = jest.spyOn(expressValidator, 'param');

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
      notificationValidator(expressValidator.body);
      expect(bodyMock).toHaveBeenCalledWith('message');
      expect(bodyMock).toHaveBeenCalledWith('title');
      expect(bodyMock).toHaveBeenCalledWith('userIDs');
      expect(mockHelperChain.exists).toHaveBeenCalledTimes(3);
      expect(mockHelperChain.notEmpty).toHaveBeenCalledTimes(3);
    });

    it('notificationIdValidator', () => {
      notificationIdValidator(expressValidator.param);
      expect(paramMock).toHaveBeenCalledWith('id');
      expect(mockHelperChain.exists).toHaveBeenCalledTimes(1);
      expect(mockHelperChain.notEmpty).toHaveBeenCalledTimes(1);
    });
  });
});
