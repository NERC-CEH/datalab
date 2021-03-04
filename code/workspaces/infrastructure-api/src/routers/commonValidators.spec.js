import { paramProjectKeyValidator } from './commonValidators';
import ValidationChainHelper from '../controllers/utils/validationChainHelper';

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
      paramProjectKeyValidator();
      expect(mockHelperChain.exists).toHaveBeenCalledWith();
      expect(mockHelperChain.notEmpty).toHaveBeenCalledWith();
    });
  });
});
